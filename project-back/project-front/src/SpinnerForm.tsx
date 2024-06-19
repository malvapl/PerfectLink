import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

export default function SpinnerForm() {
  return (
    <>
      <Button variant="contained" color="inherit" type="submit" disabled className="custom-disabled">
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        <span>CARGANDO...</span>
      </Button>
    </>
  );
}