import React, { Component } from 'react';
import PlainDraggable from 'plain-draggable';

class TextComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            xPosition: props.xPosition,
            yPosition: props.yPosition,
            fontSize: props.fontSize,
            fontColor: props.fontColor,
            text: props.text,
            textid: props.textid,
            callback: props.callback,
            lastClickedCallback: props.lastClickedCallback,
            key: props.index,
            index: props.index,
            zIndex: props.zIndex
        };
        this.draggable = null;
    }

    render()
    {
        let styles = {
            textBlock:
            {
                position: "absolute",
                top: this.state.yPosition + "px",
                left: this.state.xPosition + "px",
                fontSize: this.state.fontSize + "pt",
                color: this.state.fontColor,
                zIndex: this.state.zIndex,
                whiteSpace: "nowrap"
            }
        };

        return (
                <p id={this.state.textid} style={styles.textBlock}>{this.state.text}</p>
        );
    }

    componentDidMount()
    {
        // console.log("TC did mount");
        //if(!this.state.textid)
        //    return;

        // console.log("textid is " + this.state.textid);
        let e = document.getElementById(this.state.textid);
        console.log(e);
        this.draggable = new PlainDraggable(e, { zIndex: false, leftTop: true });
        this.draggable.onMove = (newPosition) => {
            let bounds = document.getElementById("main_logo_panel").getBoundingClientRect();
    
            let x = newPosition.left - bounds.left;
            let y = newPosition.top - bounds.top;
            this.state.callback(this.state.index, x, y);
        }
        this.draggable.onDragStart = (newPosition) => {
            this.state.lastClickedCallback(this.state.index);
        }
    }

    componentDidUpdate()
    {
        // console.log("TC did update");
        // if(!this.draggable)
        //     return;
        this.draggable.position();
    }

    componentWillReceiveProps(props)
    {
        // console.log("TC did recv props");

        this.setState({xPosition: props.xPosition});
        this.setState({yPosition: props.yPosition});
        this.setState({fontSize: props.fontSize});
        this.setState({fontColor: props.fontColor});
        this.setState({text: props.text});
        this.setState({textid: props.textid});
        this.setState({callback: props.callback});
        this.setState({lastClickedCallback: props.lastClickedCallback});
        this.setState({key: props.index});
        this.setState({index: props.index});
        this.setState({zIndex: props.zIndex});
    }
}

export default TextComponent;