import React, { Component } from 'react';
import PlainDraggable from 'plain-draggable';

class ImageComponent extends Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            xPosition: props.xPosition,
            yPosition: props.yPosition,
            source: props.source,
            width: props.width,
            height: props.height,
            imageid: props.imageid,
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
            imageBlock:
            {
                position: "absolute",
                top: this.state.yPosition + "px",
                left: this.state.xPosition + "px",
                zIndex: this.state.zIndex
            }
        };

        return (
            <img id={this.state.imageid} style={styles.imageBlock} src={this.state.source} width={this.state.width} height={this.state.height} alt="IMAGE_NOT_FOUND" />
        );
    }

    componentDidMount()
    {
        // if(!this.state.imageid)
        //     return;

        this.draggable = new PlainDraggable(document.getElementById(this.state.imageid), { zIndex: false });
        this.draggable.onMove = (newPosition) => {
            let bounds = document.getElementById("main_logo_panel").getBoundingClientRect();
    
            let x = newPosition.left - bounds.left;
            let y = newPosition.top - bounds.top;
            this.state.callback(this.state.index, x, y);
        }
        this.draggable.onDragStart = (newPosition) => {
            this.state.lastClickedCallback(this.state.key);
        }
    }

    componentDidUpdate()
    {
        // if(!this.draggable)
        //     return;
        this.draggable.position();
    }

    componentWillReceiveProps(props)
    {
        this.setState({xPosition: props.xPosition});
        this.setState({yPosition: props.yPosition});
        this.setState({source: props.source});
        this.setState({width: props.width});
        this.setState({height: props.height});
        this.setState({imageid: props.imageid});
        this.setState({callback: props.callback});
        this.setState({lastClickedCallback: props.lastClickedCallback});
        this.setState({keys: props.index});
        this.setState({index: props.index});
        this.setState({zIndex: props.zIndex});
    }
}

export default ImageComponent;