import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MembershipPurchase = () => {
    const [memberships, setMemberships] = useState([]);
    const [selectedMembershipId, setSelectedMembershipId] = useState('');

    axios.get('/api/memberships')
  .then(response => {
    console.log(response.data); // Check the structure of the response
    setMemberships(response.data);
  })
  .catch(error => console.error('Fetching memberships failed:', error));


    const handlePurchase = () => {
        axios.post('/api/memberships/buy-a-plan', {
            membershipId: selectedMembershipId
        })
        .then(() => alert('Purchase successful!'))
        .catch(error => alert(`Purchase failed: ${error.response.data}`));
    };

    return (
        <div>
            <h2>Purchase a Membership</h2>
            <select value={selectedMembershipId} onChange={(e) => setSelectedMembershipId(e.target.value)}>
                <option value="">Select a Membership</option>
                {Array.isArray(memberships) && memberships.map((membership) => (
  <option key={membership.id} value={membership.id}>{membership.name}</option>
))}

            </select>
            <button onClick={handlePurchase}>Purchase</button>
        </div>
    );
};

export default MembershipPurchase;

