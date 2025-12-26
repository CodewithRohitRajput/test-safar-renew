import React, { useState } from 'react'

const PayUForm = () => {
  const [formData, setFormData] = useState({
    key: 'eYA8w9',
    txnid: 'txn_1728848760959',
    amount: 2500,
    productinfo: 'Booking -  Explore the Himalayas 1',
    firstname: 'Ravi',
    email: 'ravi@gmail.com',
    phone: 7269047364,
    surl: 'https://localhost:3000/booking/success',
    furl: 'https://localhost:3000/booking/failure',
    hash: 'e3558f29552d12741b46a105579210734cb3db0252549b2354d5c23a600650867c624e67bceca037446539731ac15cd2e25f0ff729c98743d557f698361508eb'
  })

  // Handle form submission (Redirects to PayU)
  const handleSubmit = (e) => {
    e.preventDefault()
    const form = document.forms.payuForm
    form.submit()
  }

  // In real application, fetch the hash from the backend.
  const fetchHash = async () => {
    try {
      const response = await fetch('http://localhost:5000/generate-hash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const { hash } = await response.json()
      setFormData((prevData) => ({ ...prevData, hash }))
    } catch (error) {
      console.error('Error fetching hash:', error)
    }
  }

  return (
    <form
      name="payuForm"
      action="https://test.payu.in/_payment" // Change to live URL for production
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="key" value={formData.key} />
      <input type="hidden" name="txnid" value={formData.txnid} />
      <input type="hidden" name="amount" value={formData.amount} />
      <input type="hidden" name="productinfo" value={formData.productinfo} />
      <input type="hidden" name="firstname" value={formData.firstname} />
      <input type="hidden" name="email" value={formData.email} />
      <input type="hidden" name="phone" value={formData.phone} />
      <input type="hidden" name="surl" value={formData.surl} />
      <input type="hidden" name="furl" value={formData.furl} />
      <input type="hidden" name="hash" value={formData.hash} />
      <input
        type="hidden"
        name="service_provider"
        value={formData.service_provider}
      />
      <button type="submit">Pay Now</button>
    </form>
  )
}

export default PayUForm
