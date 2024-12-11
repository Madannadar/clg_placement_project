import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './PlaceForm.css';

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState();
  const placeId = useParams().placeId;

  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
      LPA: { value: '', isValid: false },
      contactNumber: { value: '', isValid: false },
      passoutYear: { value: '', isValid: false },
      linkedIn: { value: '', isValid: false },
      github: { value: '', isValid: false }
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        console.log('Fetching place data for ID:', placeId);
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/${placeId}`
        );
        console.log('Fetched place data:', responseData);
        setLoadedPlace(responseData.place);
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: { value: responseData.place.description, isValid: true },
            LPA: { value: responseData.place.LPA, isValid: true },
            contactNumber: { value: responseData.place.contactNumber, isValid: true },
            passoutYear: { value: responseData.place.passoutYear, isValid: true },
            linkedIn: { value: responseData.place.linkedIn, isValid: true },
            github: { value: responseData.place.github, isValid: true }
          },
          true
        );
      } catch (err) {
        console.error('Error fetching place data:', err);
      }
    };
    fetchPlace();
  }, [sendRequest, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      console.log('Form state inputs before submission:', formState.inputs);

      const updatedPlaceData = {
        title: formState.inputs.title.value || '',
        description: formState.inputs.description.value || '',
        LPA: formState.inputs.LPA.value || '',
        contactNumber: formState.inputs.contactNumber.value || '',
        passoutYear: formState.inputs.passoutYear.value || '',
        linkedIn: formState.inputs.linkedIn.value || '',
        github: formState.inputs.github.value || ''
      };

      console.log('Submitting updated place data:', updatedPlaceData);

      await sendRequest(
        `http://localhost:5000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify(updatedPlaceData),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token
        }
      );

      console.log('Place updated successfully!');
      history.push('/' + auth.userId + '/places');
    } catch (err) {
      console.error('Error updating place:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Student Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id="description"
            element="textarea"
            label="Placed Company"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (min. 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Input
            id="LPA"
            element="input"
            type="text"
            label="LPA"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid LPA."
            onInput={inputHandler}
            initialValue={loadedPlace.LPA}
            initialValid={true}
          />
          <Input
            id="contactNumber"
            element="input"
            type="text"
            label="Contact Number"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid contact number."
            onInput={inputHandler}
            initialValue={loadedPlace.contactNumber}
            initialValid={true}
          />
          <Input
            id="passoutYear"
            element="input"
            type="text"
            label="Passout Year"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid passout year."
            onInput={inputHandler}
            initialValue={loadedPlace.passoutYear}
            initialValid={true}
          />
          <Input
            id="linkedIn"
            element="input"
            type="url"
            label="LinkedIn Link"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid LinkedIn profile link."
            onInput={inputHandler}
            initialValue={loadedPlace.linkedIn}
            initialValid={true}
          />
          <Input
            id="github"
            element="input"
            type="url"
            label="GitHub Link"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid GitHub profile link."
            onInput={inputHandler}
            initialValue={loadedPlace.github}
            initialValid={true}
          />
          <Button type="submit" disabled={!formState.isValid}>
            UPDATE Student
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default UpdatePlace;
