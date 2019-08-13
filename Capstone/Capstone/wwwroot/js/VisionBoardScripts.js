$(document).ready(function () {
    var placeList = [
        {
            name: 'Hawaii',
            country: 'US',
            description: 'Paradise',
            columnNum: 1,
        },
        {
            name: 'New York',
            country: 'US',
            description: 'City that never sleeps',
            columnNum: 1,
        },
        {
            name: 'Sydney',
            country: 'Australia',
            description: 'Watch out for sharks',
            columnNum: 1,
        },
        {
            name: 'Paris',
            country: 'France',
            description: 'Oui, oui',
            columnNum: 2,
        },
        {
            name: 'Greet Barrier Reef',
            country: 'Australia',
            description: 'Pretty sweet',
            columnNum: 1,
        },
        {
            name: 'Tokyo, Japan',
            description: 'Can\'t wait to go here!',
            columnNum: 3,
        },
    ];

    $.ajax({
        url: '/Travelers/GetFuturePlacesDetails',
        data: "",
        dataType: "json",
        type: "GET",
        contentType: "application/json; chartset=utf-8",
        async: false
    })
        .done(function (data) {
            for (let i = 0; i < data.length; i++) {
                let item = {
                    name: data[i].placeName,
                    country: data[i].countryName,
                    description: data[i].notes,
                    columnNum: 1
                }                
                placeList.push(item)
            }
        });

    class VisionBoard extends React.Component {
        render() {
            const style = {
                'padding': '30px',
                'paddingTop': '5px',
                'float': 'right',
            };
            return (
                <div style={style}>
                    <VBoard />
                </div>
            );
        }
    }

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
                { name: 'Making Plans', stage: 3 },
            ];
        }

        componentDidMount() {
            this.setState({ projects: placeList, isLoading: false });
        }

        //Called by column when card is dragged over
        handleOnDragEnter(e, stageValue) {
            this.setState({ draggedOverCol: stageValue });
        }

        //Called by card when dropped over
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
                    <div><h4>{this.props.project.name}, {this.props.project.country}</h4></div>
                    {(this.state.collapsed)
                        ? null
                        : (<div><strong>Notes: </strong>{this.props.project.description}<br /></div>)
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

    $("#addCardBtn").on("click", function () {
        let newPlace = $("#placeName").val();
        let newPlaceCountry = $("#placeCountry").val();
        let newDescription = $("#placeNotes").val();
        let newPhotoUrl = $("#photoUrl").val();

        var item = {
            placeName: newPlace,
            countryName: newPlaceCountry,
            notes: newDescription,
            photoUrl: newPhotoUrl
        }
        postFuturePlace(item);
    });

    function postFuturePlace(details) {
        $.ajax({
            method: "POST",
            url: "/Travelers/PostFuturePlacesDetails",
            datatype: "JSON",
            headers: {
                "Content-Type": "application/json"
            },
            contentType: "application/json",
            data: JSON.stringify({
                "placeName": details.placeName,
                "countryName": details.countryName,
                "notes": details.notes,
                "photoUrl": details.photoUrl
            }),
            success: function (data) {
                console.log(data);
            }
        })
    };
    console.log(placeList);
    ReactDOM.render(
        <VisionBoard />, document.getElementById('app'));
});