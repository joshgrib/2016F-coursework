const CalDay = React.createClass({
    getInitialState: function () {
        return {recipes: []};
    },
    componentDidMount: function () {
        /*
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: (recipeList) => {
                this.setState({recipes: recipeList});
            },
            error: (xhr, status, err) => {
                console.error(this.props.url, status, err.toString());
            }
        });
        */
        console.log("CalDay mounted");
    },
    render: function () {
        return (
            <div className="calDay">
                It is {this.props.date}
            </div>
        );
    }
});
