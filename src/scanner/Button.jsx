import { Button as AntButton, Flex } from "antd";

const Button = (props) => {
  return (
    <Flex vertical gap="small" style={{ width: '100%' }}>
    <AntButton
      type="primary" 
      className={props.className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </AntButton>
    </Flex>
  );
};

export default Button;
