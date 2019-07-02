


/*
* VisionBoard React component
*/
class VisionBoard extends React.Component {
    render() {
        const style = {
            'padding': '30px',
            'paddingTop': '5px',
        };

        return (
            <div style={style}>
                <h1>VisionBoard</h1>
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
            { name: 'Planning', stage: 1 },
            { name: 'Design', stage: 2 },
            { name: 'In Progress', stage: 3 },
            { name: 'Testing', stage: 4 },
            { name: 'Launch', stage: 5 },
        ];
    }
