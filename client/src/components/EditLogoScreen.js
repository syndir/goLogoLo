import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import TextComponent from './TextComponent';
import ImageComponent from './ImageComponent';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Button } from 'react-materialize';

const GET_LOGO = gql`
    query logo($logoId: String) {
        logo(id: $logoId) {
            _id
            owner
            name
            logoWidth
            logoHeight
            textItems {
                textid
                zIndex
                xPosition
                yPosition
                text
                fontColor
                fontSize
            }
            imageItems {
                imageid
                zIndex
                xPosition
                yPosition
                source
                width
                height
            }
            lastUpdate
            backgroundColor
            borderColor
            borderRadius
            borderThickness
            borderMargin
            borderPadding
        }
    }
`;

const UPDATE_LOGO = gql`
    mutation updateLogo(
        $id: String!,
        $owner: String!,
        $name: String!,
        $logoWidth: Int!,
        $logoHeight: Int!,
        $textItems: [TextItemType]!,
        $imageItems: [ImageItemType]!,
        
        $backgroundColor: String!,
        $borderColor: String!,
        $borderRadius: Int!,
        $borderThickness: Int!,
        $borderMargin: Int!,
        $borderPadding: Int!
    ) 
    {
        updateLogo(
            id: $id,
            owner: $owner,
            name: $name,
            logoWidth: $logoWidth,
            logoHeight: $logoHeight,
            textItems: $textItems,
            imageItems: $imageItems,
            
            backgroundColor: $backgroundColor,
            borderColor: $borderColor,
            borderRadius: $borderRadius,
            borderThickness: $borderThickness,
            borderMargin: $borderMargin,
            borderPadding: $borderPadding
        ) 
        {
            lastUpdate
        }
    }
`;

const DELETE_LOGO = gql`
    mutation removeLogo($id: String!) {
        removeLogo(id:$id) {
            _id
        }
    }
`;

class EditLogoScreen extends Component {

    constructor() {
        super();
        this.state = {
            lastClickedText: -1,
            lastClickedImage: -1
        };
    }


    textItems = null;
    imageItems = null;


    componentDidMount() {
        this.targetItems = null;
        this.imageItems = null;
        if (this.state.lastClickedText)
            this.setState({ lastClickedText: -1 });
        if (this.state.lastClickedImage)
            this.setState({ lastClickedImage: -1 });
    }

    handleChange = (event) => {
        this.changed = true;

        let e = document.getElementById("logoName");
        this.setState({ logoName: e.value.trim() });
        e = document.getElementById("logoWidth");
        if (e.value >= 800)
            e.value = 800;
        this.setState({ logoWidth: e.value });
        e = document.getElementById("logoHeight");
        if (e.value >= 800)
            e.value = 800;
        this.setState({ logoHeight: e.value });

        e = document.getElementById("logoBackgroundColor");
        this.setState({ backgroundColor: e.value });
        e = document.getElementById("logoBorderColor");
        this.setState({ borderColor: e.value });
        e = document.getElementById("logoBorderRadius");
        this.setState({ borderRadius: e.value });
        e = document.getElementById("logoBorderThickness");
        this.setState({ borderThickness: e.value });
        e = document.getElementById("logoBorderPadding");
        this.setState({ borderPadding: e.value });
        e = document.getElementById("logoBorderMargin");
        this.setState({ borderMargin: e.value });

        this.forceUpdate();
    }

    /**
     * text stuff
     */
    updateTextPos = (index, xPos, yPos) => {
        console.log(this);
        console.log("index: " + index);
        let texts = this.textItems;
        texts[index].xPosition = parseInt(xPos);
        texts[index].yPosition = parseInt(yPos);
        console.log("updating text pos to " + xPos + ", " + yPos);
        //this.setState({ textItems: texts });
        this.changed = true;
        this.handleChange();
        this.forceUpdate();
    }

    lastTextClickedCallback = (key) => {
        console.log("last text clicked was " + key);

        this.setState({ lastClickedText: key });
        this.setState({ lastClickedTextText: this.textItems[key].text });
        this.setState({ lastClickedTextColor: this.textItems[key].fontColor });
        this.setState({ lastClickedTextSize: this.textItems[key].fontSize });

        let e = document.getElementById("textText");
        e.value = this.textItems[key].text;
        e = document.getElementById("textColor");
        e.value = this.textItems[key].fontColor;
        e = document.getElementById("textSize");
        e.value = this.textItems[key].fontSize;
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    addTextClick = (event) => {
        let texts = this.textItems;
        texts.push({
            textid: '_' + Math.random().toString(36).substr(2, 9),
            xPosition: 0,
            yPosition: 0,
            zIndex: 20,
            text: "New Text",
            fontColor: "#000000",
            fontSize: 24
        });
        //this.setState({ textItems: texts });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    handleTextChange = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("handleTextChange() - lastClickedText < 0!");
            return;
        }

        let e = document.getElementById("textText");
        let text = e.value.trim();
        e = document.getElementById("textColor");
        let color = e.value;
        e = document.getElementById("textSize");
        let size = parseInt(e.value);

        let texts = this.textItems;
        console.log("index is " + this.state.lastClickedText)
        console.log("was " + texts[this.state.lastClickedText].text + ", now: " + text);
        texts[this.state.lastClickedText].text = text;
        texts[this.state.lastClickedText].fontColor = color;
        texts[this.state.lastClickedText].fontSize = size;

        //this.setState({ textItems: texts });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    moveTextForward = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("moveTextForward() - lastClickedText < 0!");
            return;
        }

        let texts = this.textItems;
        texts[this.state.lastClickedText].zIndex++;
        if (texts[this.state.lastClickedText].zIndex <= 0)
            texts[this.state.lastClickedText].zIndex = 0;

        //this.setState({ textItems: texts });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    moveTextBackward = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("moveTextForward() - lastClickedText < 0!");
            return;
        }

        let texts = this.textItems;
        texts[this.state.lastClickedText].zIndex--;
        if (texts[this.state.lastClickedText].zIndex <= 0)
            texts[this.state.lastClickedText].zIndex = 0;

        //this.setState({ textItems: texts });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    deleteText = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("deleteText() - lastClickedText < 0!");
            return;
        }
        let texts = this.textItems;
        let removed = texts.splice(this.state.lastClickedText, 1);
        // this.setState({ textItems: texts });
        this.setState({ lastClickedText: -1 });
        this.setState({ lastClickedTextText: "New Text" });
        this.setState({ lastClickedTextColor: "#000000" });
        this.setState({ lastClickedTextSize: 24 });

        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    /**
     * Image stuff
     */

    updateImagePos = (index, xPos, yPos) => {
        let images = this.imageItems;
        let e = document.getElementById("main_logo_panel");
        images[index].xPosition = parseInt(xPos);
        images[index].yPosition = parseInt(yPos);
        console.log("updating image pos to " + xPos + ", " + yPos);
        //this.setState({ imageItems: images });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    lastImageClickedCallback = (key) => {
        console.log("last image clicked was " + key);

        this.setState({ lastClickedImage: key });
        this.setState({ lastClickedImageSource: this.imageItems[key].source });
        this.setState({ lastClickedImageWidth: this.imageItems[key].width });
        this.setState({ lastClickedImageHweight: this.imageItems[key].height });

        let e = document.getElementById("imageSource");
        e.value = this.imageItems[key].source;
        e = document.getElementById("imageWidth");
        e.value = this.imageItems[key].width;
        e = document.getElementById("imageHeight");
        e.value = this.imageItems[key].height;
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    handleImageChange = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("handleImageChange() - lastClickedImage < 0!");
            return;
        }

        let e = document.getElementById("imageSource");
        let source = e.value.trim();
        e = document.getElementById("imageWidth");
        let width = parseInt(e.value);
        e = document.getElementById("imageHeight");
        let height = parseInt(e.value);

        let images = this.imageItems;
        console.log("index is " + this.state.lastClickedImage);
        images[this.state.lastClickedImage].source = source;
        images[this.state.lastClickedImage].width = width;
        images[this.state.lastClickedImage].height = height;
        //this.setState({ imageItems: images });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    moveImageForward = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("moveImageBackward() - lastClickedImage < 0!");
            return;
        }
        let images = this.imageItems;
        images[this.state.lastClickedImage].zIndex++;
        if (images[this.state.lastClickedImage].zIndex <= 0)
            images[this.state.lastClickedImage].zIndex = 0;
        //this.setState({ imageItems: images });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    moveImageBackward = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("moveImageBackward() - lastClickedImage < 0!");
            return;
        }
        let images = this.imageItems;
        images[this.state.lastClickedImage].zIndex--;
        if (images[this.state.lastClickedImage].zIndex <= 0)
            images[this.state.lastClickedImage].zIndex = 0;
        //this.setState({ imageItems: images });
        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    deleteImage = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("deleteImage() - lastClickedImage < 0!");
            return;
        }
        let images = this.imageItems;
        let removed = images.splice(this.state.lastClickedImage, 1);
        //this.setState({ imageItems: images });
        this.setState({ lastClickedImage: -1 });
        this.setState({ lastClickedImageSource: "" });
        this.setState({ lastClickedImageWidth: 100 });
        this.setState({ lastClickedImageHweight: 100 });

        this.changed = true;
        this.handleChange();

        this.forceUpdate();
    }

    addImageClick = (event) => {
        let images = this.imageItems;
        images.push({
            imageid: '_' + Math.random().toString(36).substr(2, 9),
            xPosition: 0,
            yPosition: 0,
            zIndex: 20,
            source: "https://www.snopes.com/tachyon/2019/11/trump-rocky.png",
            width: 100,
            height: 100
        });
        //this.setState({ imageItems: images });
        this.changed = true;
        this.handleChange();
        this.forceUpdate();
    }

    /**
     * gets rid of that annoying ass "__typename is not defined" nonsense in the mutation
     */
    removeTypename = (value) => {
        if (value === null || value === undefined)
            return value;
        else if (Array.isArray(value)) {
            return value.map(v => this.removeTypename(v));
        }
        else if (typeof value === 'object') {
            const newObj = {};
            Object.keys(value).forEach(key => {
                if (key !== '__typename') {
                    newObj[key] = this.removeTypename(value[key]);
                }
            });
            return newObj;
        }
        return value;
    };

    exportLogo = (event) => {
        let e = document.getElementById("main_logo_panel");

        html2canvas(e, {
            allowTaint: true,
            proxy: "http://localhost:3000/proxy",
            width: parseInt(document.getElementById("logoWidth").value),
            height: parseInt(document.getElementById("logoHeight").value),
            scrollX: -window.scrollX - 4,
            scrollY: -window.scrollY,
            backgroundColor: null
        }).then((canvas) => {
            let e = document.getElementById("logoName");
            saveAs(canvas.toDataURL('image/png'), e.value.trim() + ".png");
        });
    }

    render() {
        let logoName, logoWidth, logoHeight;
        let textText, textColor, textSize;
        let imageSource, imageWidth, imageHeight;
        let backgroundColor, borderColor, borderRadius, borderThickness, borderPadding, borderMargin;



        return (
            <Query query={GET_LOGO} fetchPolicy={'network-only'} variables={{ logoId: this.props.match.params.id }}>
                {({ loading, error, data }) => {
                    if (loading) return 'Loading...';
                    if (error) return `Error! ${error.message}`;

                    data = this.removeTypename(data);

                    if (!this.imageItems)
                        this.imageItems = data.logo.imageItems;
                    if (!this.textItems)
                        this.textItems = data.logo.textItems;

                    var styles = null;
                    if (this.changed === true) {
                        styles = {
                            container: {
                                width: this.state.logoWidth + "px",
                                height: this.state.logoHeight + "px",
                                backgroundColor: this.state.backgroundColor,
                                borderStyle: "solid",
                                borderColor: this.state.borderColor,
                                borderRadius: this.state.borderRadius + "px",
                                borderWidth: this.state.borderThickness + "px",
                                padding: this.state.borderPadding + "px",
                                margin: this.state.borderMargin + "px",
                                marginTop: this.state.borderMargin + "px",
                                marginLeft: this.state.borderMargin + "px",
                                marginBottom: this.state.borderMargin + "px",
                                marginRight: this.state.borderMargin + "px",
                                position: "absolute"
                            }
                        }
                    }
                    else {
                        styles = {
                            container: {
                                width: data.logo.logoWidth + "px",
                                height: data.logo.logoHeight + "px",
                                backgroundColor: data.logo.backgroundColor,
                                borderStyle: "solid",
                                borderColor: data.logo.borderColor,
                                borderRadius: data.logo.borderRadius + "px",
                                borderWidth: data.logo.borderThickness + "px",
                                padding: data.logo.borderPadding + "px",
                                margin: data.logo.borderMargin + "px",
                                marginLeft: data.logo.borderMargin + "px",
                                marginTop: data.logo.borderMargin + "px",
                                marginRight: data.logo.borderMargin + "px",
                                marginBottom: data.logo.borderMargin + "px",
                                position: "absolute"
                            }
                        }
                    }

                    return (
                        <div>
                            <Mutation mutation={UPDATE_LOGO} key={data.logo._id}>
                                {(updateLogo, { loading, error }) => (
                                    <div>
                                        <div className="row">
                                            <nav>
                                                <div className='nav-wrapper col s12'>&nbsp;
                                                    <div className='brand-logo' style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/home/' + this.props.location.state.owner} >
                                                        goLogoLo
                                                    </div>
                                                    <div className='right'>
                                                        <Mutation mutation={DELETE_LOGO} key={data.logo._id} onCompleted={() => this.props.history.push('/home/' + this.props.location.state.owner)}>
                                                            {(removeLogo, { loading, error }) => (
                                                                <Button type="button" className="red" onClick={(e) => {
                                                                    e.preventDefault();
                                                                    removeLogo({ variables: { id: data.logo._id } });
                                                                }}>
                                                                    Delete Logo
                                                                </Button>
                                                            )}
                                                        </Mutation>
                                                        <Button className='red' onClick={(e) => {
                                                            window.location.href = 'http://localhost:3000/logout'
                                                        }}>Logout</Button>
                                                    </div>
                                                </div>
                                            </nav>
                                        </div>
                                        <div className="row span12">
                                            <div className="col s4" style={{ marginLeft: "25px", marginTop: "10px" }}>
                                                <div className="panel-heading">
                                                    <h3 className="panel-title">
                                                        Edit Logo
                                        </h3>
                                                </div>
                                                <div className="col" id="sidebar">
                                                    <form onSubmit={e => {
                                                        e.preventDefault();

                                                        console.log(this.textItems);
                                                        console.log(this.imageItems);

                                                        updateLogo(
                                                            {
                                                                variables: {
                                                                    id: data.logo._id,
                                                                    owner: data.logo.owner,
                                                                    name: data.logo.name,
                                                                    logoWidth: parseInt(logoWidth.value),
                                                                    logoHeight: parseInt(logoHeight.value),
                                                                    textItems: this.textItems,
                                                                    imageItems: this.imageItems,
                                                                    backgroundColor: backgroundColor.value,
                                                                    borderColor: borderColor.value,
                                                                    borderRadius: parseInt(borderRadius.value),
                                                                    borderThickness: parseInt(borderThickness.value),
                                                                    borderPadding: parseInt(borderPadding.value),
                                                                    borderMargin: parseInt(borderMargin.value)
                                                                }
                                                            });


                                                    }}>
                                                        <div className="border-0" style={{ padding: "10px" }}>
                                                            <div className="form-group">
                                                                <label htmlFor="name">Logo Name:</label>
                                                                <input type="text" className="form-control" name="text" ref={node => {
                                                                    logoName = node;
                                                                }} placeholder="Logo Name" defaultValue={data.logo.name} minLength="1" id="logoName" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="logoWidth">Logo Width:</label>
                                                                <input type="number" className="form-control" name="logoWidth" ref={node => {
                                                                    logoWidth = node;
                                                                }} placeholder="Logo Width" defaultValue={data.logo.logoWidth} min="1" max="800" id="logoWidth" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="logoHeight">Logo Height:</label>
                                                                <input type="number" className="form-control" name="logoHeight" ref={node => {
                                                                    logoHeight = node;
                                                                }} placeholder="Logo Height" defaultValue={data.logo.logoHeight} min="1" max="800" id="logoHeight" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="backgroundColor">Background Color:</label>
                                                                <input type="color" className="form-control right" name="backgroundColor" ref={node => {
                                                                    backgroundColor = node;
                                                                }} placeholder="Background Color" defaultValue={data.logo.backgroundColor} id="logoBackgroundColor" onChange={this.handleChange} />
                                                            </div>
                                                        </div>

                                                        <div className="border-0" style={{ padding: "10px" }}>
                                                            <div className="form-group">
                                                                <label htmlFor="borderColor">Border Color:</label>
                                                                <input type="color" className="form-control right" name="borderColor" ref={node => {
                                                                    borderColor = node;
                                                                }} placeholder="Border Color" defaultValue={data.logo.borderColor} id="logoBorderColor" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="borderRadius">Border Radius:</label>
                                                                <input type="number" className="form-control" name="borderRadius" min="0" max="100" ref={node => {
                                                                    borderRadius = node;
                                                                }} placeholder="Border Radius" defaultValue={data.logo.borderRadius} id="logoBorderRadius" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="borderThickness">Border Thickness:</label>
                                                                <input type="number" className="form-control" name="borderThickness" min="0" max="100" ref={node => {
                                                                    borderThickness = node;
                                                                }} placeholder="Border Thickness" defaultValue={data.logo.borderThickness} id="logoBorderThickness" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="borderMargin">Border Margin:</label>
                                                                <input type="number" className="form-control" name="borderMargin" min="0" max="100" ref={node => {
                                                                    borderMargin = node;
                                                                }} placeholder="Border Margin" defaultValue={data.logo.borderMargin} id="logoBorderMargin" onChange={this.handleChange} />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="borderPadding">Border Padding:</label>
                                                                <input type="number" className="form-control" name="borderPadding" min="0" max="100" ref={node => {
                                                                    borderPadding = node;
                                                                }} placeholder="Border Padding" defaultValue={data.logo.borderPadding} id="logoBorderPadding" onChange={this.handleChange} />
                                                            </div>
                                                        </div>

                                                        {this.state.lastClickedText >= 0 &&
                                                            <div className="form-group border border-dark" style={{ padding: "10px" }}>
                                                                <div className="form-group">
                                                                    <label htmlFor="textText">Text:</label>
                                                                    <input type="text" className="form-control" name="textText" ref={node => {
                                                                        textText = node;
                                                                    }} placeholder="Text" defaultValue={this.textItems[this.state.lastClickedText].text} id="textText" onChange={this.handleTextChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="textColor">Text Color:</label>
                                                                    <input type="color" className="form-control right" name="textColor" ref={node => {
                                                                        textColor = node;
                                                                    }} placeholder="Text Color" defaultValue={this.textItems[this.state.lastClickedText].fontColor} id="textColor" onChange={this.handleTextChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="textSize">Font Size:</label>
                                                                    <input type="number" className="form-control" name="textSize" ref={node => {
                                                                        textSize = node;
                                                                    }} placeholder="Font Size" defaultValue={this.textItems[this.state.lastClickedText].fontSize} min="1" max="100" id="textSize" onChange={this.handleTextChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <center>
                                                                        <Button type="button" className="grey" onClick={this.moveTextForward}>Move Front</Button>
                                                                        <Button type="button" className="grey" onClick={this.moveTextBackward}>Move Back</Button>
                                                                    </center>
                                                                </div>
                                                                <div className="form-group">
                                                                    <center><Button type="button" className="red" onClick={this.deleteText}>Remove Text</Button></center>
                                                                </div>
                                                            </div>
                                                        }

                                                        {this.state.lastClickedImage >= 0 &&
                                                            <div className="form-group border border-dark" style={{ padding: "10px" }}>
                                                                <div className="form-group">
                                                                    <label htmlFor="imageSource">Image Source:</label>
                                                                    <input type="text" className="form-control" name="imageSource" ref={node => {
                                                                        imageSource = node;
                                                                    }} placeholder="Image Source" defaultValue={this.imageItems[this.state.lastClickedImage].source} id="imageSource" onChange={this.handleImageChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="imageWidth">Image Width:</label>
                                                                    <input type="number" className="form-control" name="imageWidth" ref={node => {
                                                                        imageWidth = node;
                                                                    }} placeholder="Image Width" min="1" defaultValue={this.imageItems[this.state.lastClickedImage].width} id="imageWidth" onChange={this.handleImageChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label htmlFor="imageHeight">Image Height:</label>
                                                                    <input type="number" className="form-control" name="imageHeight" ref={node => {
                                                                        imageHeight = node;
                                                                    }} placeholder="Image Height" min="1" defaultValue={this.imageItems[this.state.lastClickedImage].height} id="imageHeight" onChange={this.handleImageChange} />
                                                                </div>
                                                                <div className="form-group">
                                                                    <center>
                                                                        <Button type="button" className="grey" onClick={this.moveImageForward}>Move Front</Button>
                                                                        <Button type="button" className="grey" onClick={this.moveImageBackward}>Move Back</Button>
                                                                    </center>
                                                                </div>
                                                                <div className="form-group">
                                                                    <center><Button type="button" className="red" onClick={this.deleteImage}>Remove Image</Button></center>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="row">
                                                            <Button type="button" className="blue left" onClick={this.addTextClick}>Add Text</Button>
                                                            <Button type="button" className="blue middle" onClick={this.addImageClick}>Add Image</Button>
                                                            <Button type="button" className="blue right" onClick={this.exportLogo}>Export Logo</Button>
                                                        </div>

                                                        <div className="row">
                                                            <Button type="submit" className="green right">Save</Button>
                                                        </div>

                                                    </form>

                                                    {loading && <p>Loading...</p>}
                                                    {error && <p>Error :( Please try again</p>}
                                                </div>
                                            </div>
                                            <div className="col span8" id="barrier" style={{ marginLeft: "10px", marginTop: "10px" }}>
                                                <div className='container' id="main_logo_panel" style={styles.container}>
                                                    {this.textItems.map(
                                                        (text, index) =>
                                                            <TextComponent fontSize={text.fontSize} key={index} index={index} textid={text.textid}
                                                                xPosition={text.xPosition} yPosition={text.yPosition} text={text.text}
                                                                fontColor={text.fontColor} callback={this.updateTextPos}
                                                                lastClickedCallback={this.lastTextClickedCallback}
                                                                zIndex={text.zIndex} />
                                                    )}
                                                    {this.imageItems.map(
                                                        (image, index) =>
                                                            <ImageComponent key={index} index={index} imageid={image.imageid}
                                                                xPosition={image.xPosition} yPosition={image.yPosition} source={image.source}
                                                                width={image.width} height={image.height} callback={this.updateImagePos}
                                                                lastClickedCallback={this.lastImageClickedCallback}
                                                                zIndex={image.zIndex} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Mutation>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default EditLogoScreen;