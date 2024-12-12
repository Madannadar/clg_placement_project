import React, { useState } from 'react';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import './PlaceList.css';

const PlaceList = (props) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' for ascending and 'desc' for descending
  const [branchFilter, setBranchFilter] = useState([]); // State to hold selected branches
  const [isBranchListVisible, setIsBranchListVisible] = useState(false); // State to toggle visibility of branch list

  const availableBranches = ['CE', 'IT', 'AIML', 'EXTC', 'MECH', 'IOT', 'AIDS']; // Available branches

  // Filter places based on the search term and selected branches
  const filteredPlaces = props.items.filter((place) => {
    const matchesSearch = place.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter.length === 0 || branchFilter.includes(place.branch);
    return matchesSearch && matchesBranch;
  });

  // Sort places based on LPA value
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

  // Update the branch filter state when a checkbox is toggled
  const branchCheckboxChangeHandler = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setBranchFilter((prevBranches) => [...prevBranches, value]); // Add branch to filter
    } else {
      setBranchFilter((prevBranches) => prevBranches.filter((branch) => branch !== value)); // Remove branch from filter
    }
  };

  // Toggle visibility of the branch list when the button is clicked
  const toggleBranchListHandler = () => {
    setIsBranchListVisible((prevVisibility) => !prevVisibility);
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

      {/* Branch Filter Button */}
      <div className="place-list__filter">
        <Button inverse onClick={toggleBranchListHandler}>
          {isBranchListVisible ? 'Hide Branch Filter' : 'Select Branches'}
        </Button>
      </div>

      {/* Branch Filter List */}
      {isBranchListVisible && (
        <div className="branch-filter">
          {availableBranches.map((branch) => (
            <label key={branch} className="branch-checkbox">
              <input
                type="checkbox"
                value={branch}
                onChange={branchCheckboxChangeHandler}
                checked={branchFilter.includes(branch)}
              />
              {branch}
            </label>
          ))}
        </div>
      )}

      {/* Sort Button */}
      <div className="place-list__filter">
        <button onClick={toggleSortOrderHandler}>
          Sort by LPA ({sortOrder === 'asc' ? 'Greater to Lower' : 'Lower to Greater'})
        </button>
      </div>

      {/* Render "Search Not Found" message if no results found for search */}
      {sortedPlaces.length === 0 && searchTerm.trim().length > 0 && (
        <div className="place-list center">
          <Card>
            <h2>Search Not Found</h2>
          </Card>
        </div>
      )}

      {/* Render "No places found" message with "Share Place" button if no places are available */}
      {sortedPlaces.length === 0 && searchTerm.trim().length === 0 && (
        <div className="place-list center">
          <Card>
            <h2>No places found.</h2>
            <Button to="/places/new">Share Place</Button>
          </Card>
        </div>
      )}

      {/* Render the list of places */}
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
              passoutYear={place.passoutYear}
              contactNumber={place.contactNumber}
              linkedIn={place.linkedIn}
              github={place.github}
              branch={place.branch}
              onDelete={props.onDeletePlace}
            />
          ))}
        </ul>
      )}
    </React.Fragment>
  );
};

export default PlaceList;
