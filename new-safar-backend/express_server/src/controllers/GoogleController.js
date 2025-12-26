const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    getGoogleReviews : async (req , res) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJzdy64F7jYjkRvdyYHSzrhck&fields=name,rating,reviews&key=${process.env.GOOGLE_PLACE_API}`)
        const data = await response.json();
        res.json(data.result.reviews);
    }
}