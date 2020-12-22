import React, { Component } from 'react';
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import { Link } from 'react-router-dom';
import TextComponent from './TextComponent.js';
import ImageComponent from './ImageComponent.js';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Button } from 'react-materialize';

const ADD_LOGO = gql`
    mutation AddLogo(
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
        addLogo(
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
            _id
        }
    }
`;

class CreateLogoScreen extends Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            logoName: "Untitled Logo",
            logoWidth: 250,
            logoHeight: 250,
            backgroundColor: "#ffffff",
            borderColor: "#5a5a5a",
            borderRadius: 15,
            borderThickness: 5,
            borderMargin: 5,
            borderPadding: 5,
            textItems: [],
            imageItems: [],
            lastClickedText: -1,
            lastClickedImage: -1
        };
    }

    handleChange = (event) => {
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
        e = document.getElementById("logoBorderMargin");
        this.setState({ borderMargin: e.value });
        e = document.getElementById("logoBorderPadding");
        this.setState({ borderPadding: e.value });

        this.forceUpdate();
    }

    exportLogo = (event) => {
        let e = document.getElementById("main_logo_panel");

        html2canvas(e, {
            allowTaint: true,
            proxy: "http://localhost:3000/proxy",
            width: this.state.logoWidth,
            height: this.state.logoHeight,
            scrollX: -window.scrollX - 4,
            scrollY: -window.scrollY,
            backgroundColor: null
        }).then((canvas) => {
            saveAs(canvas.toDataURL('image/png'), this.state.logoName + ".png");
        });
    }

    /**
     * text stuff
     */
    updateTextPos = (index, xPos, yPos) => {
        let texts = this.state.textItems;
        texts[index].xPosition = parseInt(xPos);
        texts[index].yPosition = parseInt(yPos);
        console.log("updating text pos to " + xPos + ", " + yPos);
        this.setState({ textItems: texts });
        this.forceUpdate();
    }

    lastTextClickedCallback = (key) => {
        console.log("last text clicked was " + key);

        this.setState({ lastClickedText: key });
        this.setState({ lastClickedTextText: this.state.textItems[key].text });
        this.setState({ lastClickedTextColor: this.state.textItems[key].fontColor });
        this.setState({ lastClickedTextSize: this.state.textItems[key].fontSize });

        let e = document.getElementById("textText");
        e.value = this.state.textItems[key].text;
        e = document.getElementById("textColor");
        e.value = this.state.textItems[key].fontColor;
        e = document.getElementById("textSize");
        e.value = this.state.textItems[key].fontSize;
        this.forceUpdate();
    }

    addTextClick = (event) => {
        let texts = this.state.textItems;
        texts.push({
            textid: '_' + Math.random().toString(36).substr(2, 9),
            xPosition: 0,
            yPosition: 0,
            zIndex: 20,
            text: "New Text",
            fontColor: "#000000",
            fontSize: 24
        });
        this.setState({ textItems: texts });
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

        let texts = this.state.textItems;
        console.log("index is " + this.state.lastClickedText)
        console.log("was " + texts[this.state.lastClickedText].text + ", now: " + text);
        texts[this.state.lastClickedText].text = text;
        texts[this.state.lastClickedText].fontColor = color;
        texts[this.state.lastClickedText].fontSize = size;

        this.setState({ textItems: texts });
        this.forceUpdate();
    }

    moveTextForward = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("moveTextForward() - lastClickedText < 0!");
            return;
        }

        let texts = this.state.textItems;
        texts[this.state.lastClickedText].zIndex++;
        if (texts[this.state.lastClickedText].zIndex <= 0)
            texts[this.state.lastClickedText].zIndex = 0;

        this.setState({ textItems: texts });
        this.forceUpdate();
    }

    moveTextBackward = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("moveTextForward() - lastClickedText < 0!");
            return;
        }

        let texts = this.state.textItems;
        texts[this.state.lastClickedText].zIndex--;
        if (texts[this.state.lastClickedText].zIndex <= 0)
            texts[this.state.lastClickedText].zIndex = 0;

        this.setState({ textItems: texts });
        this.forceUpdate();
    }

    deleteText = (event) => {
        if (this.state.lastClickedText < 0) {
            console.log("deleteText() - lastClickedText < 0!");
            return;
        }
        let texts = this.state.textItems;
        let removed = texts.splice(this.state.lastClickedText, 1);
        this.setState({ textItems: texts });
        this.setState({ lastClickedText: -1 });
        this.forceUpdate();
    }

    /**
     * Image stuff
     */

    updateImagePos = (index, xPos, yPos) => {
        let images = this.state.imageItems;
        images[index].xPosition = parseInt(xPos);
        images[index].yPosition = parseInt(yPos);
        console.log("updating image pos to " + xPos + ", " + yPos);
        this.setState({ imageItems: images });
        this.forceUpdate();
    }

    lastImageClickedCallback = (key) => {
        console.log("last image clicked was " + key);

        this.setState({ lastClickedImage: key });
        this.setState({ lastClickedImageSource: this.state.imageItems[key].source });
        this.setState({ lastClickedImageWidth: this.state.imageItems[key].width });
        this.setState({ lastClickedImageHweight: this.state.imageItems[key].height });

        let e = document.getElementById("imageSource");
        e.value = this.state.imageItems[key].source;
        e = document.getElementById("imageWidth");
        e.value = this.state.imageItems[key].width;
        e = document.getElementById("imageHeight");
        e.value = this.state.imageItems[key].height;
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

        let images = this.state.imageItems;
        console.log("index is " + this.state.lastClickedImage);
        images[this.state.lastClickedImage].source = source;
        images[this.state.lastClickedImage].width = width;
        images[this.state.lastClickedImage].height = height;
        this.setState({ imageItems: images });

        this.forceUpdate();
    }

    moveImageForward = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("moveImageBackward() - lastClickedImage < 0!");
            return;
        }
        let images = this.state.imageItems;
        images[this.state.lastClickedImage].zIndex++;
        if (images[this.state.lastClickedImage].zIndex <= 0)
            images[this.state.lastClickedImage].zIndex = 0;
        this.setState({ imageItems: images });
        this.forceUpdate();
    }

    moveImageBackward = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("moveImageBackward() - lastClickedImage < 0!");
            return;
        }
        let images = this.state.imageItems;
        images[this.state.lastClickedImage].zIndex--;
        if (images[this.state.lastClickedImage].zIndex <= 0)
            images[this.state.lastClickedImage].zIndex = 0;
        this.setState({ imageItems: images });
        this.forceUpdate();
    }

    deleteImage = (event) => {
        if (this.state.lastClickedImage < 0) {
            console.log("deleteImage() - lastClickedImage < 0!");
            return;
        }
        let images = this.state.imageItems;
        let removed = images.splice(this.state.lastClickedImage, 1);
        this.setState({ imageItems: images });
        this.setState({ lastClickedImage: -1 });
        this.forceUpdate();
    }

    addImageClick = (event) => {
        let images = this.state.imageItems;
        images.push({
            imageid: '_' + Math.random().toString(36).substr(2, 9),
            xPosition: 0,
            yPosition: 0,
            zIndex: 20,
            source: "https://www.snopes.com/tachyon/2019/11/trump-rocky.png",
            width: 100,
            height: 100
        });
        this.setState({ imageItems: images });
    }



    render() {
        let logoName, logoWidth, logoHeight, backgroundColor;
        let borderColor, borderRadius, borderThickness, borderMargin, borderPadding;

        let textText, textSize, textColor;
        let imageSource, imageWidth, imageHeight;

        var styles = null;

        styles = {
            container: {
                width: this.state.logoWidth + "px",
                height: this.state.logoHeight + "px",
                backgroundColor: this.state.backgroundColor,
                borderStyle: "solid",
                borderColor: this.state.borderColor,
                borderRadius: this.state.borderRadius + "px",
                borderWidth: this.state.borderThickness + "px",
                marginTop: this.state.borderMargin + "px",
                marginLeft: this.state.borderMargin + "px",
                marginBottom: this.state.borderMargin + "px",
                marginRight: this.state.borderMargin + "px",
                padding: this.state.borderPadding + "px",
                position: "absolute"
            }
        }



        return (
            <Mutation mutation={ADD_LOGO} onCompleted={() => this.props.history.push('/home/' + this.props.location.state.owner)}>
                {(addLogo, { loading, error }) => (
                    <div>
                        <div className="row">
                            <nav>
                                <div className='nav-wrapper col s12'>&nbsp;
                                <div className='brand-logo' style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/home/' + this.props.location.state.owner} >
                                        goLogoLo
                                </div>
                                <div className='right'>
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
                                        Create Logo
                                </h3>
                                </div>
                                <div className="col" id="sidebar">
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        addLogo(
                                            {
                                                variables: {
                                                    owner: this.props.location.state.owner,
                                                    name: logoName.value.trim(),
                                                    logoWidth: parseInt(logoWidth.value),
                                                    logoHeight: parseInt(logoHeight.value),
                                                    textItems: this.state.textItems,
                                                    imageItems: this.state.imageItems,
                                                    backgroundColor: backgroundColor.value,
                                                    borderColor: borderColor.value,
                                                    borderRadius: parseInt(borderRadius.value),
                                                    borderThickness: parseInt(borderThickness.value),
                                                    borderMargin: parseInt(borderMargin.value),
                                                    borderPadding: parseInt(borderPadding.value)
                                                }
                                            });
                                    }}>
                                        <div className="border-0" style={{ padding: "10px" }}>
                                            <div className="form-group">
                                                <label htmlFor="name">Logo Name:</label>
                                                <input type="text" className="form-control" name="text" ref={node => {
                                                    logoName = node;
                                                }} placeholder="Logo Name" defaultValue="Untitled Logo" minLength="1" id="logoName" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="logoWidth">Logo Width:</label>
                                                <input type="number" className="form-control right" name="logoWidth" ref={node => {
                                                    logoWidth = node;
                                                }} placeholder="Logo Width" defaultValue="250" min="1" max="800" id="logoWidth" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="logoHeight">Logo Height:</label>
                                                <input type="number" className="form-control" name="logoHeight" ref={node => {
                                                    logoHeight = node;
                                                }} placeholder="Logo Height" defaultValue="250" min="1" max="800" id="logoHeight" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="backgroundColor">Background Color:</label>
                                                <input type="color" className="form-control right" name="backgroundColor" ref={node => {
                                                    backgroundColor = node;
                                                }} placeholder="Background Color" defaultValue="#ffffff" id="logoBackgroundColor" onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        <div className="border-0" style={{ padding: "10px" }}>
                                            <div className="form-group">
                                                <label htmlFor="borderColor">Border Color:</label>
                                                <input type="color" className="form-control right" name="borderColor" ref={node => {
                                                    borderColor = node;
                                                }} placeholder="Border Color" defaultValue="#5a5a5a" id="logoBorderColor" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="borderRadius">Border Radius:</label>
                                                <input type="number" className="form-control" name="borderRadius" min="0" max="100" ref={node => {
                                                    borderRadius = node;
                                                }} placeholder="Border Radius" defaultValue="15" id="logoBorderRadius" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="borderThickness">Border Thickness:</label>
                                                <input type="number" className="form-control" name="borderThickness" min="0" max="100" ref={node => {
                                                    borderThickness = node;
                                                }} placeholder="Border Thickness" defaultValue="5" id="logoBorderThickness" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="borderMargin">Border Margin:</label>
                                                <input type="number" className="form-control" name="borderMargin" min="0" max="100" ref={node => {
                                                    borderMargin = node;
                                                }} placeholder="Border Margin" defaultValue="5" id="logoBorderMargin" onChange={this.handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="borderPadding">Border Padding:</label>
                                                <input type="number" className="form-control" name="borderPadding" min="0" max="100" ref={node => {
                                                    borderPadding = node;
                                                }} placeholder="Border Padding" defaultValue="5" id="logoBorderPadding" onChange={this.handleChange} />
                                            </div>
                                        </div>

                                        {this.state.lastClickedText >= 0 &&
                                            <div className="form-group border border-dark" style={{ padding: "10px" }}>
                                                <div className="form-group">
                                                    <label htmlFor="textText">Text:</label>
                                                    <input type="text" className="form-control" name="textText" ref={node => {
                                                        textText = node;
                                                    }} placeholder="Text" defaultValue="New Text" id="textText" onChange={this.handleTextChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="textColor">Text Color:</label>
                                                    <input type="color" className="form-control right" name="textColor" ref={node => {
                                                        textColor = node;
                                                    }} placeholder="Text Color" defaultValue="#000000" id="textColor" onChange={this.handleTextChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="textSize">Font Size:</label>
                                                    <input type="number" className="form-control" name="textSize" ref={node => {
                                                        textSize = node;
                                                    }} placeholder="Font Size" defaultValue="24" min="1" max="100" id="textSize" onChange={this.handleTextChange} />
                                                </div>
                                                <div className="form-group">
                                                    <center>
                                                        <Button type="button" className="grey" onClick={this.moveTextForward}>Move Front</Button>
                                                        <Button type="button" className="grey" onClick={this.moveTextBackward}>Move Back</Button>
                                                    </center>
                                                </div>
                                                <div className="form-group">
                                                    <center>
                                                        <Button type="button" className='red' onClick={this.deleteText}>Remove Text</Button>
                                                    </center>
                                                </div>
                                            </div>
                                        }
                                        {this.state.lastClickedImage >= 0 &&
                                            <div className="form-group border border-dark" style={{ padding: "10px" }}>
                                                <div className="form-group">
                                                    <label htmlFor="imageSource">Image Source:</label>
                                                    <input type="text" className="form-control" name="imageSource" ref={node => {
                                                        imageSource = node;
                                                    }} placeholder="Image Source" defaultValue="" id="imageSource" onChange={this.handleImageChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="imageWidth">Image Width:</label>
                                                    <input type="number" className="form-control" name="imageWidth" ref={node => {
                                                        imageWidth = node;
                                                    }} placeholder="Image Width" min="1" defaultValue="100" id="imageWidth" onChange={this.handleImageChange} />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="imageHeight">Image Height:</label>
                                                    <input type="number" className="form-control" name="imageHeight" ref={node => {
                                                        imageHeight = node;
                                                    }} placeholder="Image Height" min="1" defaultValue="100" id="imageHeight" onChange={this.handleImageChange} />
                                                </div>
                                                <div className="form-group">
                                                    <center>
                                                        <Button className="grey" onClick={this.moveImageForward}>Move Front</Button>
                                                        <Button className="grey" onClick={this.moveImageBackward}>Move Back</Button>
                                                    </center>
                                                </div>
                                                <div className="form-group">
                                                    <center><Button className="red" onClick={this.deleteImage}>Remove Image</Button></center>
                                                </div>
                                            </div>
                                        }

                                        <div className="row">
                                            <Button type="button" className="blue left" onClick={this.addTextClick}>Add Text</Button>
                                            <Button type="button" className="blue middle" onClick={this.addImageClick}>Add Image</Button>
                                            <Button type="button" className="blue right" onClick={this.exportLogo}>Export Logo</Button>
                                        </div>

                                        <div className="row">
                                            <Button type="submit" className="green right">Submit</Button>
                                        </div>
                                    </form>
                                    {loading && <p>Loading...</p>}
                                    {error && <p>Error :( Please try again</p>}
                                </div>
                            </div>
                            <div className="col span8" id="barrier" style={{ marginLeft: "10px", marginTop: "10px" }}>
                                <div className="container" id="main_logo_panel" style={styles.container}>
                                    {this.state.textItems.map(
                                        (text, index) =>
                                            <TextComponent fontSize={text.fontSize} key={index} index={index} textid={text.textid}
                                                xPosition={text.xPosition} yPosition={text.yPosition} text={text.text}
                                                fontColor={text.fontColor} callback={this.updateTextPos}
                                                lastClickedCallback={this.lastTextClickedCallback}
                                                zIndex={text.zIndex} />
                                    )}
                                    {this.state.imageItems.map(
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
        );
    }
}

export default CreateLogoScreen;