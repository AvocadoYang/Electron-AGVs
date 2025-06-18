import { Form } from 'antd';
import styled from 'styled-components';

export const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 16px;
  }

  .ant-form-item-label > label {
    font-weight: 600;
    color: #555;
  }

  .ant-select,
  .ant-input {
    border-radius: 8px;
    padding: 6px 12px;
  }

  button {
    margin-top: 24px;
    width: 100%;
    background-color: #1677ff;
    color: white;
    font-weight: bold;
    border-radius: 8px;
  }
`;

export const StyledJsonPreview = styled.div`
  padding: 12px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  font-size: 13px;
`;
