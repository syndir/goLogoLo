var mongoose = require('mongoose');
// var TextImte = require('../graphql/logoSchemas').TextItem;
// var ImageItem = require('../graphql/logoSchemas').ImageItem;

var LogoSchema = new mongoose.Schema({
  id: String,
  lastUpdate: { type: Date, default: Date.now },

  /* logo info */
  owner: { type: String },
  name: { type: String, default: "New Logo" },
  backgroundColor: { type: String, default: "#fafafa" },
  logoWidth: { type: Number, min: 1, max: 800, default: 250 },
  logoHeight: { type: Number, min: 1, max: 800, default: 250 },

  /* text items */
  textItems: { type: Array, default: [] },/*
    {
      textid: String,
      zIndex: { type: Number, min: 0, max: 100, default: 0 },
      xPosition: { type: Number, min: 0, default: 0 },
      yPosition: { type: Number, min: 0, default: 0 },
      tText: { type: String, default:"New Text Item" },
      tColor: { type: String, default: "#000000" },
      tSize: { type: Number, min: 2, max: 100, default: 24 }
    }
  ],

  /* image items */
  imageItems: { type: Array, default: [] },/*
    {
      imageid: String,
      zIndex: { type: Number, min: 0, max: 100, default: 0 },
      xPosition: { type: Number, min: 0, default: 0 },
      yPosition: { type: Number, min: 0, default: 0 },
      iSource: { type: String, default: "" },
      iWidth: { type: Number, min: 1, default: 100 },
      iHeight: { type: Number, min: 1, default: 100 }
    }
  ],
  
  /* border info */
  borderColor: {type: String, default: "#5a5a5a" },
  borderRadius: { type: Number, min: 0, max: 100, default: 15 },
  borderThickness: { type: Number, min: 0, max: 100, default: 5 },
  borderMargin: { type: Number, min: 0, max: 100, default: 5 },
  borderPadding: { type: Number, min: 0, max: 100, default: 5 }
});

module.exports = mongoose.model('Logo', LogoSchema);