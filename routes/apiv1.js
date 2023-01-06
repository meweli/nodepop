var express = require('express');
const mongoose = require("mongoose");
var router = express.Router();

const Schema = mongoose.Schema;

const adSchema = new Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]}
);  

const adsCollection = mongoose.model("Ad", adSchema, "ads");

/* GET home page */
router.get('/', function(req, res) {
  res.render('index', { title: 'Nodepop (api V1!)' });
});

function generate_ads_query(req) {
  // parses the URL query into the required mongoDB query format, 
  // according to the API specification

    let query = req.query;

    if ("tag" in query) {
      query["tags"] = query.tag;
      delete query["tag"];
    }

    if ("nombre" in query) {
      query["nombre"] = { $regex: new RegExp('^' + query.nombre, "i") };
    }

    if ("sort" in query) {
      query["sort"] = { [query.sort]: 1 };
    } else {
      query["sort"] = {};
    }

    if ("precio" in query) {
      let hyphenPos = query.precio.indexOf("-");
      let priceQuery = "";

      if (hyphenPos === 0) {
        priceQuery = { $lte: query.precio.slice(1) };
      } else if (hyphenPos > 0) {
        // either a range or a gte
        if (query.precio.length - 1 === hyphenPos) {
          priceQuery = { $gte: query.precio.slice(0, -1) };
        } else {
          priceQuery = { $gte: query.precio.slice(0, hyphenPos),
                         $lte: query.precio.slice(hyphenPos + 1, query.precio.length) };
        }
      } else {
        priceQuery = query.precio;
      }
      query["precio"] = priceQuery;
    }

    return query;

}

// GET ads with filters and return options.
router.get('/ads', async function (req, res) {

  // parse parameters and get query
  const query = generate_ads_query(req);

  let ads = await adsCollection.find(query).sort(query.sort);

  // induce pageing by default
  if (!("start" in query)) {
    query["start"] = 0;
  }

  if (!("limit" in query)) {
    query["limit"] = ads.length;
  }

  // return the filtered list of ads as a JSON response
  res.json(ads.slice(query.start, query.limit));
});

// GET existing unique tags tags
router.get('/tags', async function (req, res) {
  const uniqueTagLists = await adsCollection.distinct("tags");
  res.send(uniqueTagLists);
});

module.exports = router;
