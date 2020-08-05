import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/react-hooks";

import { Form, Input, Select, Button } from "antd";

import { v4 as uuidv4 } from "uuid";

import { ADD_INSTRUMENT, GET_ARTISTS, GET_INSTRUMENTS } from "../../queries";

const AddInstrument = () => {
  const [addInstrument] = useMutation(ADD_INSTRUMENT);

  const { Option } = Select;
  const [form] = Form.useForm();
  const [, forceUpdate] = useState();

  const [aId, setAId] = useState("");

  function handleChange(value) {
    console.log(`selected ${value}`);
    setAId(value);
  }

  // To disable submit button at the beginning.
  useEffect(() => {
    forceUpdate({});
  }, []);

  const onFinish = (values) => {
    const { year, brand, type, price } = values;
    const id = uuidv4();
    let artistId = "2";
    addInstrument({
      variables: {
        id,
        year,
        brand,
        type,
        price,
        artistId,
      },
      optimisticResponse: {
        __typename: "Mutation",
        addInstrument: {
          __typename: "Instrument",
          id,
          year,
          brand,
          type,
          price,
          artistId,
        },
      },
      update: (proxy, { data: { addInstrument } }) => {
        const data = proxy.readQuery({
          query: GET_INSTRUMENTS,
          variables: { artistId: artistId },
        });
        proxy.writeQuery({
          query: GET_INSTRUMENTS,
          variables: { artistId: artistId },
          data: {
            ...data,
            instruments: [...data.instruments, addInstrument],
          },
        });
      },
    });
  };

  return (
    <Form
      form={form}
      name="add-instrument-form"
      layout="inline"
      onFinish={onFinish}
      size="large"
      style={{ marginBottom: "40px" }}
    >
      <Form.Item
        name="year"
        rules={[{ required: true, message: "Please input year!" }]}
      >
        <Input placeholder="i.e. 2001" />
      </Form.Item>

      <Form.Item
        name="brand"
        rules={[{ required: true, message: "Please input brand!" }]}
      >
        <Input placeholder="i.e. Fazioli" />
      </Form.Item>

      <Form.Item
        name="type"
        rules={[{ required: true, message: "Please input type!" }]}
      >
        <Input placeholder="i.e. Concert Piano" />
      </Form.Item>

      <Form.Item
        name="price"
        rules={[{ required: true, message: "Please input price!" }]}
      >
        <Input placeholder="i.e. 200000" />
      </Form.Item>

      <Select
        defaultValue="lucy"
        style={{ width: 120 }}
        onChange={handleChange}
      >
        <Option value="jack">Jack</Option>
        <Option value="lucy">Lucy</Option>
      </Select>

      <Form.Item shouldUpdate={true}>
        {() => (
          <Button
            type="primary"
            htmlType="submit"
            disabled={
              !form.isFieldsTouched(true) ||
              form.getFieldsError().filter(({ errors }) => errors.length).length
            }
          >
            Add Instrument
          </Button>
        )}
      </Form.Item>
    </Form>
  );
};

export default AddInstrument;
