var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var LogoModel = require('../models/Logo');

var TextItemType = new GraphQLInputObjectType({
    name: 'TextItemType',
    description: 'Input payload for text item',
    fields: () => ({
            textid: { type: GraphQLString },
            zIndex: { type: GraphQLInt, min: 0, max: 100, default: 0 },
            xPosition: { type: GraphQLInt, min: 0, default: 0 },
            yPosition: { type: GraphQLInt, min: 0, default: 0 },
            text: { type: GraphQLString, default:"New Text Item" },
            fontColor: { type: GraphQLString, default: "#000000" },
            fontSize: { type: GraphQLInt, min: 2, max: 100, default: 24 }
    })
})

var TextItem = new GraphQLObjectType({
    name: 'TextItem',
    description: 'type for text item',
    fields: () => ({
            textid: { type: GraphQLString },
            zIndex: { type: GraphQLInt, min: 0, max: 100, default: 0 },
            xPosition: { type: GraphQLInt, min: 0, default: 0 },
            yPosition: { type: GraphQLInt, min: 0, default: 0 },
            text: { type: GraphQLString, default:"New Text Item" },
            fontColor: { type: GraphQLString, default: "#000000" },
            fontSize: { type: GraphQLInt, min: 2, max: 100, default: 24 }
    })
})

var ImageItemType = new GraphQLInputObjectType({
    name: 'ImageItemType',
    description: 'Input payload for image item',
    fields: () => ({
            imageid: { type: GraphQLString },
            zIndex: { type: GraphQLInt, min: 0, max: 100, default: 0 },
            xPosition: { type: GraphQLInt, min: 0, default: 0 },
            yPosition: { type: GraphQLInt, min: 0, default: 0 },
            source: { type: GraphQLString, default: "" },
            width: { type: GraphQLInt, min: 1, default: 100 },
            height: { type: GraphQLInt, min: 1, default: 100 }
    })
})

var ImageItem = new GraphQLObjectType({
    name: 'ImageItem',
    description: 'payload for image item',
    fields: () => ({
            imageid: { type: GraphQLString },
            zIndex: { type: GraphQLInt, min: 0, max: 100, default: 0 },
            xPosition: { type: GraphQLInt, min: 0, default: 0 },
            yPosition: { type: GraphQLInt, min: 0, default: 0 },
            source: { type: GraphQLString, default: "" },
            width: { type: GraphQLInt, min: 1, default: 100 },
            height: { type: GraphQLInt, min: 1, default: 100 }
    })
})

var logoType = new GraphQLObjectType({
    name: 'logo',
    fields: () => ({
            _id: {
                type: GraphQLString
            },
            owner: {
                type: GraphQLString
            },
            name: {
                type: GraphQLString
            },
            logoWidth: {
                type: GraphQLInt
            },
            logoHeight: {
                type: GraphQLInt
            },
            textItems: {
                type: GraphQLList(TextItem)
            },
            imageItems: {
                type: GraphQLList(ImageItem)
            },
            lastUpdate: {
                type: GraphQLDate
            },
            backgroundColor: {
                type: GraphQLString
            },
            borderColor: {
                type: GraphQLString
            },
            borderRadius: {
                type: GraphQLInt
            },
            borderThickness: {
                type: GraphQLInt
            },
            borderMargin: {
                type: GraphQLInt
            },
            borderPadding: {
                type: GraphQLInt
            }
    })
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields:  () => ({
            allLogos: {
                type: new GraphQLList(logoType),
                resolve: function() {
                    const logos = LogoModel.find().exec();
                    if(!logos) {
                        throw new Error ('Error');
                    }
                    return logos;
                }
            },
            logos: {
                type: new GraphQLList(logoType),
                args: {
                    owner: {
                        name: 'owner',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logos = LogoModel.find({owner: params.owner}).exec();
                    if (!logos) {
                        throw new Error('Error')
                    }
                    return logos
                }
            },
            logo: {
                type: logoType,
                args: {
                    id: {
                        name: '_id',
                        type: GraphQLString
                    }
                },
                resolve: function (root, params) {
                    const logoDetails = LogoModel.findById(params.id).exec()
                    if (!logoDetails) {
                        throw new Error('Error')
                    }
                    return logoDetails
                }
            }
    })
});

var mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: function () {
        return {
            addLogo: {
                type: logoType,
                args: {
                    owner: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logoWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    logoHeight: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    textItems: {
                        type: new GraphQLNonNull(new GraphQLList(TextItemType))
                    },
                    imageItems: {
                        type: new GraphQLNonNull(new GraphQLList(ImageItemType))
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderThickness: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderMargin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderPadding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve: function (root, params) {
                    /*if(params.text.trim().length < 1)
                        throw new Error('You must enter some text!')*/
                    const logoModel = new LogoModel(params);
                    const newLogo = logoModel.save();
                    if (!newLogo) {
                        throw new Error('Error');
                    }
                    return newLogo
                }
            },
            updateLogo: {
                type: logoType,
                args: {
                    id: {
                        name: 'id',
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    owner: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    name: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    logoWidth: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    logoHeight: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    textItems: {
                        type: new GraphQLNonNull(new GraphQLList(TextItemType))
                    },
                    imageItems: {
                        type: new GraphQLNonNull(new GraphQLList(ImageItemType))
                    },
                    backgroundColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderColor: {
                        type: new GraphQLNonNull(GraphQLString)
                    },
                    borderRadius: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderThickness: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderMargin: {
                        type: new GraphQLNonNull(GraphQLInt)
                    },
                    borderPadding: {
                        type: new GraphQLNonNull(GraphQLInt)
                    }
                },
                resolve(root, params) {
                    /*
                    if(params.text.trim().length < 1)
                        throw new Error('You must enter some text!');
                      */  
                    return LogoModel.findByIdAndUpdate(params.id, 
                        { 
                            name: params.name,
                            logoWidth: params.logoWidth,
                            logoHeight: params.logoHeight,
                            textItems: params.textItems,
                            imageItems: params.imageItems,
                            lastUpdate: new Date(),
                            backgroundColor: params.backgroundColor,
                            borderColor: params.borderColor,
                            borderRadius: params.borderRadius,
                            borderThickness: params.borderThickness,
                            borderMargin: params.borderMargin,
                            borderPadding: params.borderPadding
                        }, function (err) {
                        if (err) return next(err);
                    });
                }
            },
            removeLogo: {
                type: logoType,
                args: {
                    id: {
                        type: new GraphQLNonNull(GraphQLString)
                    }
                },
                resolve(root, params) {
                    const remLogo = LogoModel.findByIdAndRemove(params.id).exec();
                    if (!remLogo) {
                        throw new Error('Error')
                    }
                    return remLogo;
                }
            }
        }
    }
});

module.exports = new GraphQLSchema({ query: queryType, mutation: mutation });