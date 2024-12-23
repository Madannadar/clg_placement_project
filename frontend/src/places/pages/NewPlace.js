import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      contactNumber: {
        value: '',
        isValid: false
      },
      passoutYear: {
        value: '',
        isValid: false
      },
      image: {
        value: null,
        isValid: false
      },
      linkedIn: {
        value: '',
        isValid: false
      },
      github: {
        value: '',
        isValid: false
      },
      LPA: {
        value: '',
        isValid: false
      },
      branch: { // Added branch field
        value: '',
        isValid: false
      }
    },
    false
  );

  const history = useHistory();

  const placeSubmitHandler = async event => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', formState.inputs.title.value);
      formData.append('description', formState.inputs.description.value);
      formData.append('contactNumber', formState.inputs.contactNumber.value);
      formData.append('passoutYear', formState.inputs.passoutYear.value);
      formData.append('image', formState.inputs.image.value);
      formData.append('linkedIn', formState.inputs.linkedIn.value);
      formData.append('github', formState.inputs.github.value);
      formData.append('LPA', formState.inputs.LPA.value);
      formData.append('branch', formState.inputs.branch.value); // Include branch field in form data
      await sendRequest('http://localhost:5000/api/places', 'POST', formData, {
        Authorization: 'Bearer ' + auth.token
      });
      history.push('/');
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Student Name"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid name."
          onInput={inputHandler}
        />
        <Input
          id="description"
          element="textarea"
          label="Placed Company"
          validators={[VALIDATOR_MINLENGTH(3)]}
          errorText="Please enter a valid description (at least 3 characters)."
          onInput={inputHandler}
        />
        <Input
          id="LPA"
          element="input"
          type="text"
          label="LPA"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid LPA."
          onInput={inputHandler}
        />
        <Input
          id="contactNumber"
          element="input"
          type="text"
          label="Contact Number"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid contact number."
          onInput={inputHandler}
        />
        <Input
          id="passoutYear"
          element="input"
          type="text"
          label="Passout Year"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid passout year."
          onInput={inputHandler}
        />
        <Input
          id="branch" // Added branch input field here
          element="input"
          type="text"
          label="Branch"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid branch."
          onInput={inputHandler}
        />
        <ImageUpload
          id="image"
          onInput={inputHandler}
          errorText="Please provide an image."
        />
        <Input
          id="linkedIn"
          element="input"
          type="url"
          label="LinkedIn Link"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid LinkedIn profile link."
          onInput={inputHandler}
        />
        <Input
          id="github"
          element="input"
          type="url"
          label="GitHub Link"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid GitHub profile link."
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>
          ADD Student
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
