import React from 'react';
import './ActionUnit.css';

class ActionUnit extends React.Component {
  constructor(props) {
    super();
    this.actionUnitSettings = props;
    console.log(props);
  }

  componentDidMount(props) {
  }

  render(props) {
    let actionUnitClassName;
    if (this.actionUnitSettings.actionUnit==="NotActive") {
      actionUnitClassName = 'ActionUnit';
    }
    else {
      actionUnitClassName = 'ActionUnit ' + this.actionUnitSettings.actionClass;
    }
    return (
      <div id={this.props.actionClass} className={actionUnitClassName}>
        {this.props.actionName}
      </div>
    );
  }
}

export default ActionUnit;
