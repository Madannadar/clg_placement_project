import React from "react";
import { Link } from "react-router-dom";
// import Avatar from "../../shared/components/UIElements/Avatar";
// import Card from "../../shared/components/UIElements/Card";
import "./UserItem.css";

const UserItem = (props) => {
  // Calculate percentage of students
  const studentPercentage = ((props.placeCount / 630) * 100).toFixed(2);

  return (
    <li className="user-item">
      <div className="user-item__content">
        <Link
          to={`/${props.id}/places`}
          className="ag-courses-item_link"
          aria-label={`View details for ${props.name}`}
        >
          <div className="ag-courses-item_bg"></div>
          {/* <div className="user-item__image">
            <Avatar
              image={`http://localhost:5000/${props.image}`}
              alt={props.name}
            />
          </div> */}
          <div className="user-item__info">
            <h2 className="ag-courses-item_title">{props.name}</h2>
            <h3 className="ag-courses-item_date-box">
              {props.placeCount}{" "}
              {props.placeCount === 1 ? "Student" : "Students"} (
              {studentPercentage}%)
            </h3>
          </div>
        </Link>
      </div>
    </li>
  );
};

export default UserItem;
