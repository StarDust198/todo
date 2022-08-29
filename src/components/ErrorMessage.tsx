interface ErrorMessageProps {
  error: string;
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  return <p className="text-center">{`There was an error: ${error}`}</p>;
};

export default ErrorMessage;
