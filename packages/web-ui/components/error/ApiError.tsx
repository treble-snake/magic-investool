import {Alert} from 'antd';

export const ApiError = ({error}: {error: Error | null}) => {
  if (!error) {
    return null;
  }

  return <Alert
    message="Error"
    description={`Something went wrong: ${error.message || 'check the console'}`}
    type="error"
    showIcon
  />;
}