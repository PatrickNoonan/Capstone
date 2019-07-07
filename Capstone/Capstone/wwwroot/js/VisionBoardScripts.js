/*
* VisionBoard React component
*/
class VisionBoard extends React.Component {
    render() {
        const style = {
            'padding': '30px',
            'paddingTop': '5px',
            'float': 'right',
        };

        return (
            <div style={style}>

                <h1 className="whiteText">Destination Board</h1>
                <VBoard />
            </div>
        );
    }
}

/*
* VisionBoard Board React component
*/
class VBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            isLoading: true,
            projects: [],
            draggedOverCol: 0,
        });
        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.columns = [
            { name: 'Cool Places', stage: 1 },
            { name: 'Bucket List', stage: 2 },
            { name: 'Must see', stage: 3 },
        ];
    }

    componentDidMount() {
        this.setState({ projects: placeList, isLoading: false });
    }

    //this is called when a VisionBoard card is dragged over a column (called by column)
    handleOnDragEnter(e, stageValue) {
        this.setState({ draggedOverCol: stageValue });
    }

    //this is called when a VisionBoard card dropped over a column (called by card)
    handleOnDragEnd(e, project) {
        const updatedProjects = this.state.projects.slice(0);
        updatedProjects.find((projectObject) => { return projectObject.name === project.name; }).columnNum = this.state.draggedOverCol;
        this.setState({ projects: updatedProjects });
    }

    render() {
        if (this.state.isLoading) {
            return (
                <h3>Loading...</h3>);
        }

        return (
            <div>
                {this.columns.map((column) => {
                    return (
                        <VBColumn name={column.name}
                            stage={column.stage}
                            projects={this.state.projects.filter((project) => { return parseInt(project.columnNum, 10) === column.stage; })}
                            onDragEnter={this.handleOnDragEnter}
                            onDragEnd={this.handleOnDragEnd}
                            key={column.stage}
                        />
                    );
                })}
            </div>
        );
    }
}

/*
* The VisionBoard Board Column React component
*/
class VBColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({ mouseIsHovering: false });
    }

    componentWillReceiveProps(nextProps) {
        this.state = ({ mouseIsHovering: false });
    }

    generateVBCards() {
        return this.props.projects.slice(0).map((project) => {
            return (
                <VBCard project={project}
                    key={project.name}
                    onDragEnd={this.props.onDragEnd} />
            );
        });
    }

    render() {
        const columnStyle = {
            'display': 'inline-block',
            'verticalAlign': 'top',
            'marginRight': '5px',
            'marginBottom': '5px',
            'paddingLeft': '5px',
            'paddingTop': '0px',
            'width': '230px',
            'textAlign': 'center',
            'backgroundColor': (this.state.mouseIsHovering) ? '#517FA4' : 'rgba(38, 38, 38, 0.3)',
        };
        return (
            <div style={columnStyle}
                onDragEnter={(e) => { this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.stage); }}
                onDragExit={(e) => { this.setState({ mouseIsHovering: false }); }}
            >
                <h4 className="whiteText">{this.props.name}<div>

                </div></h4>
                {this.generateVBCards()}
                <br />
            </div>);
    }
}

/*
* The VisionBoard Board Card component
*/
class VBCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
        };
    }

    render() {
        const cardStyle = {
            'backgroundColor': '#B0D5FC',
            'paddingLeft': '0px',
            'paddingTop': '5px',
            'paddingBottom': '5px',
            'marginLeft': '0px',
            'marginRight': '5px',
            'marginBottom': '5px',
        };

        return (
            <div style={cardStyle}
                draggable={true}
                onDragEnd={(e) => { this.props.onDragEnd(e, this.props.project); }}
            >
                <div><h4>{this.props.project.name}</h4></div>
                {(this.state.collapsed)
                    ? null
                    : (<div><strong>Description: </strong>{this.props.project.description}<br /></div>)
                }
                <div style={{ 'width': '100%' }}
                    onClick={(e) => { this.setState({ collapsed: !this.state.collapsed }); }}
                >
                    {(this.state.collapsed) ? String.fromCharCode('9660') : String.fromCharCode('9650')}

                </div>

            </div>
        );
    }
}

/*
* Projects to be displayed on VisionBoard Board
*/
var placeList = [
    {
        name: 'Hawaii, US',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
    {
        name: 'New York, US',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
    {
        name: 'Sydney, Australia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
    {
        name: 'Paris, France',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 2,
    },
    {
        name: 'London, England',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 3,
    },
    {
        name: 'Tokyo, Japan',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 3,
    },
    {
        name: 'Buenos Aires, Argentina',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 3,
    },
    {
        name: 'Bora Bora, French Polynesia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 3,
    },
    {
        name: 'Bali, Indonesia',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 2,
    },
    {
        name: 'Amsterdam, Netherlands',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 2,
    },
    {
        name: 'Venice, Italy',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 2,
    },
    {
        name: 'Geneva, Switzerland',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
    {
        name: 'Reykjavík, Iceland',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
    {
        name: 'Lisbon, Portugal',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 2,
    },
    {
        name: 'Dubai, UAE',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere dui vel urna egestas rutrum. ',
        columnNum: 1,
    },
];





$("#addCardBtn").on("click", function () {
    let newPlace = $("#placeName").val();
    let newDescription = $("#placeDescription").val();
    let columnPlacement = parseInt($("#columnNum").val());

    var item = {
        name: newPlace,
        description: newDescription,
        columnNum: columnPlacement,
    }
    placeList.push(item);

});

// Render the VisionBoard Board in the "app" div
ReactDOM.render(
    <VisionBoard />, document.getElementById('app'));
