import React, { useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending and 'desc' for descending

  // Filter places based on the search term
  const filteredPlaces = props.items.filter((place) =>
    place.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort places based on the LPA value
  const sortedPlaces = filteredPlaces.sort((a, b) => {
    const LPAA = a.LPA ? parseFloat(a.LPA) : 0;
    const LPAB = b.LPA ? parseFloat(b.LPA) : 0;

    if (sortOrder === 'asc') {
      return LPAA - LPAB; // Ascending order
    } else {
      return LPAB - LPAA; // Descending order
    }
  });

  // Update the search term state on input change
  const searchChangeHandler = (event) => {
    setSearchTerm(event.target.value);
  };

  // Toggle sorting order between ascending and descending
  const toggleSortOrderHandler = () => {
    setSortOrder((prevSortOrder) => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <React.Fragment>
      {/* Search Input */}
      <div className="place-list__filter">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={searchChangeHandler}
        />
      </div>

      {/* Sort Button */}
      <div className="place-list__filter">
        <button onClick={toggleSortOrderHandler}>
          Sort by LPA ({sortOrder === 'asc' ? 'Greater to Lower' : 'Lower to Greater'})
        </button>
      </div>

      {/* Render "Search Not Found" message if there are no matches for the search */}
      {sortedPlaces.length === 0 && searchTerm.trim().length > 0 && (
        <div className="place-list center">
          <Card>
            <h2>Search Not Found</h2>
          </Card>
        </div>
      )}

      {/* Render "No places found" message with "Share Place" button if no places are available at all */}
      {sortedPlaces.length === 0 && searchTerm.trim().length === 0 && (
        <div className="place-list center">
          <Card>
            <h2>No places found. Maybe create one?</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        </div>
      )}

      {/* Render the list of places if there are matches */}
      {sortedPlaces.length > 0 && (
        <ul className="place-list">
          {sortedPlaces.map((place) => (
            <PlaceItem
              key={place.id}
              id={place.id}
              image={place.image}
              title={place.title}
              description={place.description}
              address={place.address}
              creatorId={place.creator}
              coordinates={place.location}
              LPA={place.LPA}
              passoutYear={place.passoutYear} // Ensure 'passoutYear' is passed as prop
              contactNumber={place.contactNumber} // Ensure 'contactNumber' is passed as prop
              linkedIn={place.linkedIn} // Ensure 'linkedIn' is passed as prop
              github={place.github} // Ensure 'github' is passed as prop
              onDelete={props.onDeletePlace}
            />
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default PlaceList;
