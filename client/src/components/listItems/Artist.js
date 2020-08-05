import React, { useState } from "react";
import { Card, List } from "antd";

import { EditOutlined } from "@ant-design/icons";
import UpdateArtist from "../forms/UpdateArtist";
import RemoveArtist from "../buttons/RemoveArtist";

const getStyles = () => ({
  card: {
    width: "500px",
  },
});

const Artist = (props) => {
  const [id] = useState(props.id);
  const [firstName, setFirstName] = useState(props.firstName);
  const [lastName, setLastName] = useState(props.lastName);
  const [editMode, setEditMode] = useState(false);
  const instruments = props.instruments;

  const styles = getStyles();

  const fullName = () => {
    return `${props.firstName} ${props.lastName}`;
  };

  const updateStateVariable = (variable, value) => {
    switch (variable) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      default:
        break;
    }
  };

  const handleButtonClick = () => setEditMode(!editMode);

  return (
    <List.Item key={props.id}>
      {editMode ? (
        <UpdateArtist
          id={id}
          firstName={firstName}
          lastName={lastName}
          onButtonClick={handleButtonClick}
          updateStateVariable={updateStateVariable}
        />
      ) : (
        <Card
          actions={[
            <EditOutlined key="edit" onClick={handleButtonClick} />,
            <RemoveArtist id={id} firstName={firstName} lastName={lastName} />,
          ]}
          style={styles.card}
        >
          {fullName()}
          {instruments &&
            instruments.map((instrument) => (
              <Card
                style={{ marginTop: 16 }}
                type="inner"
                title={instrument.brand}
                key={instrument.id}
              >
                <h4>Year - {instrument.year}</h4>
                <h4>Type - {instrument.type}</h4>
                <h4>PRice - {instrument.price}</h4>
              </Card>
            ))}
        </Card>
      )}
    </List.Item>
  );
};

export default Artist;
