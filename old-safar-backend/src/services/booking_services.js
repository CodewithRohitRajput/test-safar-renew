const { CommonHelper } = require("../../utils/common.helper");
const Constant = require("../../configs/constant");
const PayUHelper = require("../../utils/payu.helper.js");
const { PrismaClient } = require("@prisma/client");
const { create } = require("payu-websdk/wrapper/invoice.js");
const { MailHelper } = require("../../utils/mail.helper.js");

const prisma = new PrismaClient({});

const AddBooking = async ({
  customer,
  people_count,
  travellers,
  itinerary_id,
  batch_id,
  total_price,
  paid_amount,
}) => {
  const txnid = `txn_${Date.now()}`;
  const currentYear = new Date().getFullYear();
  const batch = await prisma.batch.findUnique({
    where: {
      id: batch_id,
    },
  });
  if (!batch) {
    throw new Error("Batch not found");
  }
  if (batch.start_date < new Date()) {
    throw new Error("Batch is expired");
  }
  if (batch.is_sold) {
    throw new Error("Batch is sold out");
  }
  const itinerary_name = await prisma.itinerary.findUnique({
    where: {
      id: itinerary_id,
    },
    select: {
      id: true,
      title: true,
      base_packages: true,
      pickup_point: true,
      drop_point: true,
    },
  });
  if (!itinerary_name) {
    throw new Error("Itinerary not found");
  }
  const isAmountValid = await checkTotalAmount(
    total_price,
    itinerary_name,
    customer,
    travellers,
    batch_id
  );
  if (!isAmountValid) {
    throw new Error("Total amount is not valid");
  } else {
    const [booking] = await prisma.$transaction([
      prisma.bookings.create({
        data: {
          customer: {
            create: {
              ...customer,
            },
          },
          people_count: people_count,
          travellers: {
            create: travellers.map((traveller) => ({ ...traveller })),
          },
          itinerary_id: itinerary_id,

          batch_id: batch_id,

          total_price: total_price,
          paid_amount: paid_amount,
          txn_id: txnid,
          transaction: {
            create: {
              payment_amount: paid_amount,
              txn_id: txnid,
              payment_date: new Date(),
              phone: `${customer.phone}`,
              email: customer.email,
            },
          },
        },
        include: {
          customer: true,
          travellers: true,
          transaction: true,
        },
      }),
    ]);
    //initiate payu transaction

    const key = process.env.PAYU_KEY;

    const productinfo = `Booking - ${itinerary_name.title}`;
    const hash = PayUHelper.generateHash({
      key: key,
      txnid: txnid,
      amount: paid_amount,
      productinfo: productinfo,
      firstname: customer.name,
      email: customer.email,
      udf1: booking.id,
    });

    const payUData = {
      key: key,
      txnid: txnid,
      amount: paid_amount,
      productinfo: productinfo,
      firstname: customer.name,
      email: customer.email,
      phone: customer.phone,
      surl: `${process.env.BACKEND_BASE_URL}/booking/success`,  // Backend API endpoint
      furl: `${process.env.BACKEND_BASE_URL}/booking/failure`,
      hash: hash,
    };

    return { booking, payUData };
  }
};

const checkTotalAmount = async (
  total_price,
  itinerary_name,
  customer,
  travellers,
  batch_id = null  
) => {
  const customer_total = await calculateTravellerAmount(
    customer,
    itinerary_name,
    batch_id  
  );
  let traveller_total = 0;

  for (const traveller of travellers) {
    const temp_total = await calculateTravellerAmount(
      traveller,
      itinerary_name,
      batch_id  
    );
    traveller_total += temp_total;
  }

  const total_amount = customer_total + traveller_total;
  return total_amount <= total_price;
};

const calculateTravellerAmount = async (traveller, itin, batchId = null) => {
  const traveller_package = await prisma.package.findUnique({
    where: {
      id: traveller.package_id,
    },
  });

  
  let batchExtraAmount = 0;
  if (batchId) {
    const batch = await prisma.batch.findUnique({
      where: { id: batchId }
    });
    if (batch && batch.extra_amount) {
      batchExtraAmount = batch.extra_amount;
    }
  }

  let [startPrice, dropPrice] = await prisma.$transaction([
    prisma.pickPrice.findFirst({
      where: {
        itineraryId: itin.id,
        name: traveller.starting_point,
      },
    }),
    prisma.dropPrice.findFirst({
      where: {
        itineraryId: itin.id,
        name: traveller.drop_point,
      },
    }),
  ]);
  
  if (!startPrice || !dropPrice) {
    throw new Error("Price not found");
  }
  
  startPrice = startPrice.price;
  dropPrice = dropPrice.price;

  return startPrice + dropPrice + traveller_package.discounted_price + batchExtraAmount;  
};

const PaymentSuccess = async (payuResponse) => {
  // PayU sends txnid in the response - extract it
  const txnid = payuResponse.txnid;
  
  if (!txnid) {
    console.error("PaymentSuccess: Missing txnid in PayU response");
    throw new Error("Transaction ID is required");
  }
  
  let dashboardData = await prisma.dashboardData.findFirst({
    where: {
      current_year: `${new Date().getFullYear()}`,
    },
    select: {
      id: true,
      monthly_data: {
        where: {
          month: Constant.MONTH[new Date().getMonth()],
        },
      },
    },
  });
  if (!dashboardData) {
    dashboardData = await prisma.dashboardData.create({
      data: {
        current_year: `${new Date().getFullYear()}`,
        total_requests: 0,
        total_bookings: 0,
        total_revenue: 0,
        monthly_data: {
          create: {
            month: Constant.MONTH[new Date().getMonth()],
            requests: 0,
            bookings: 0,
            revenue: 0,
          },
        },
      },
    });
  }
  const booking = await prisma.bookings.findFirst({
    where: {
      txn_id: txnid,
    },
    include: {
      customer: true,
      travellers: true,
    },
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  const transaction = await prisma.transaction.findFirst({
    where: {
      txn_id: txnid,
    },
  });

  await prisma.$transaction([
    prisma.bookings.update({
      where: {
        id: booking.id,
      },
      data: {
        transaction_status: "SUCCESS",
      },
    }),
    prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        payment_status: "SUCCESS",
      },
    }),
    prisma.dashboardData.update({
      where: {
        id: dashboardData.id,
      },
      data: {
        total_revenue: {
          increment: booking.total_price,
        },
        total_bookings: {
          increment: 1,
        },
        monthly_data: {
          update: {
            where: {
              id: dashboardData.monthly_data[0].id,
            },
            data: {
              revenue: {
                increment: booking.total_price,
              },
              bookings: {
                increment: 1,
              },
            },
          },
        },
      },
    }),
  ]);
  await SendConfirmationMail(booking.id);

  return booking;
};

const SendConfirmationMail = async (id) => {
  const booking = await prisma.bookings.findUnique({
    where: {
      id: id,
    },
    include: {
      customer: true,
      travellers: true,
      transaction: true,
    },
  });
  const [itin, batch] = await prisma.$transaction([
    prisma.itinerary.findUnique({
      where: {
        id: booking.itinerary_id,
      },
    }),
    prisma.batch.findUnique({
      where: {
        id: booking.batch_id,
      },
    }),
  ]);
  const data = {
    name: booking.customer.name,
    phone: booking.customer.phone,
    email: booking.customer.email,
    order_id: booking.id,
    package_name: itin.title,
    batch_details: `${new Date(batch.start_date).toLocaleDateString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    })} to ${new Date(batch.end_date).toLocaleDateString("en-gb", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    })}`,
  };
  const customer_details = {};
  const traveller_details = [];
  customer_details.name = booking.customer.name;
  customer_details.startingPoint = booking.customer.starting_point;
  customer_details.dropPoint = booking.customer.drop_point;
  const customer_package = await prisma.package.findUnique({
    where: {
      id: booking.customer.package_id,
    },
  });
  customer_details.price = customer_package.discounted_price;
  customer_details.package_name = customer_package.name;
  [customer_details.startPrice, customer_details.dropPrice] =
    await prisma.$transaction([
      prisma.pickPrice.findFirst({
        where: {
          itineraryId: itin.id,
          name: booking.customer.starting_point,
        },
      }),
      prisma.dropPrice.findFirst({
        where: {
          itineraryId: itin.id,
          name: booking.customer.drop_point,
        },
      }),
    ]);

  customer_details.startPrice = customer_details.startPrice.price;
  customer_details.dropPrice = customer_details.dropPrice.price;
  traveller_details.push(customer_details);
  for (const traveller of booking.travellers) {
    const traveller_package = await prisma.package.findUnique({
      where: {
        id: traveller.package_id,
      },
    });
    const traveller_detail = {};
    traveller_detail.name = traveller.name;
    traveller_detail.startingPoint = traveller.starting_point;
    traveller_detail.dropPoint = traveller.drop_point;
    traveller_detail.price = traveller_package.discounted_price;
    traveller_detail.package_name = traveller_package.name;
    [traveller_detail.startPrice, traveller_detail.dropPrice] =
      await prisma.$transaction([
        prisma.pickPrice.findFirst({
          where: {
            itineraryId: itin.id,
            name: traveller.starting_point,
          },
        }),
        prisma.dropPrice.findFirst({
          where: {
            itineraryId: itin.id,
            name: traveller.drop_point,
          },
        }),
      ]);
    traveller_detail.startPrice = traveller_detail.startPrice.price;
    traveller_detail.dropPrice = traveller_detail.dropPrice.price;
    traveller_details.push(traveller_detail);
  }
  data.travelers = traveller_details;
  data.paid_amount = booking.paid_amount;
  data.total_amount = booking.total_price;
  data.remaining_amount = booking.total_price - booking.paid_amount;
  data.status = booking.status;
  data.transaction_id = booking.transaction.txn_id;
  data.amount = booking.transaction.payment_amount;
  data.date = new Date(booking.transaction.payment_date).toLocaleDateString(
    "en-gb",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "utc",
    }
  );
  await MailHelper.sendMail(data);
};

const PaymentFailure = async ({ udf1, hash, key, var1, txnid }) => {
  const booking = await prisma.bookings.findFirst({
    where: {
      txn_id: txnid,
    },
    include: {
      customer: true,
      travellers: true,
    },
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  await prisma.bookings.update({
    where: {
      id: booking.id,
    },
    data: {
      transaction_status: "FAILED",
    },
  });
  const transaction = await prisma.transaction.findFirst({
    where: {
      txn_id: txnid,
    },
  });
  await prisma.transaction.update({
    where: {
      id: transaction.id,
    },
    data: {
      payment_status: "FAILED",
    },
  });

  return booking;
};

const RetryPayment = ({ id }) => {};
module.exports = {
  AddBooking,
  PaymentSuccess,
  PaymentFailure,
};