// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import { RxDropdownMenu } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { PiDotsThreeBold } from "react-icons/pi";

function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupingOption, setGroupingOption] = useState('status'); // Default grouping option
  const [sortingOption, setSortingOption] = useState('priority'); // Default sorting option
  const [groupedTickets, setGroupedTickets] = useState({});
  const [sortedTickets, setSortedTickets] = useState({});

  const priorityMap = {
    0: "No priority",
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Urgent"
  }

  useEffect(() => {
    // Fetch data from API
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets);
        setUsers(data.users);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    // Group tickets when tickets or groupingOption changes
    setGroupedTickets(groupTickets());
  }, [tickets, groupingOption]);

  useEffect(() => {
    // Sort tickets when groupedTickets or sortingOption changes
    setSortedTickets(sortTickets(groupedTickets));
  }, [groupedTickets, sortingOption]);

  // Function to group tickets based on selected option
  const groupTickets = () => {
    if (groupingOption === 'status') {
      return tickets.reduce((groupedTickets, ticket) => {
        const status = ticket.status;
        if (!groupedTickets[status]) {
          groupedTickets[status] = [];
        }
        groupedTickets[status].push(ticket);
        return groupedTickets;
      }, {});
    } else if (groupingOption === 'user') {
      return tickets.reduce((groupedTickets, ticket) => {
        const user = users.find(user => user.id === ticket.userId);
        const userName = user ? user.name : 'Unassigned';
        if (!groupedTickets[userName]) {
          groupedTickets[userName] = [];
        }
        groupedTickets[userName].push(ticket);
        return groupedTickets;
      }, {});
    } else if (groupingOption === 'priority') {
      return tickets.reduce((groupedTickets, ticket) => {
        const priority = ticket.priority;
        if (!groupedTickets[priority]) {
          groupedTickets[priority] = [];
        }
        groupedTickets[priority].push(ticket);
        return groupedTickets;
      }, {});
    }
  };

  // Function to sort tickets based on selected option
  const sortTickets = (groupedTickets) => {
    const sorted = {};
    for (const key in groupedTickets) {
      if (groupedTickets.hasOwnProperty(key)) {
        sorted[key] = [...groupedTickets[key]].sort((a, b) => {
          if (sortingOption === 'priority') {
            return b.priority - a.priority;
          } else {
            return a.title.localeCompare(b.title);
          }
        });
      }
    }
    return sorted;
  };

  return (
    <div className="App">
      {/* First Section: Display Menu */}
      <div className="display-section">
        <div className="dropdown">
          <button className="dropdown-toggle" onMouseEnter={() => setShowMenu(true)}>
            <RxDropdownMenu className='dropdown-icon' />
            Display
          </button>
          {
            showMenu ?
              <div className="dropdown-menu" onMouseLeave={() => setShowMenu(false)}>
                <div className="dropdown-item">
                  <label>Grouping:</label>
                  <select onChange={(e) => setGroupingOption(e.target.value)} className='select-item'>
                    <option value="status">Status</option>
                    <option value="user">User</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
                <div className="dropdown-item">
                  <label>Ordering:</label>
                  <select onChange={(e) => setSortingOption(e.target.value)} className='select-item'>
                    <option value="priority">Priority</option>
                    <option value="title">Title</option>
                  </select>
                </div>
              </div>
              :
              null
          }

        </div>
      </div>

      {/* Second Section: Display Cards */}
      <div className="cards-section">
        {Object.keys(sortedTickets).map((group, index) => (
          <div key={index} className="group-column">
            <div className='group-type'>
              <h2 className='group'>{groupingOption === "priority" ? priorityMap[group] : group}</h2>
              <span className='group-options'>
                <FaPlus style={{ marginRight: "15px" }} />
                <PiDotsThreeBold />
              </span>

            </div>

            {sortedTickets[group].map(ticket => (
              <div key={ticket.id} className="card">
                <div className="card-info">
                  <p className='ticketId'>{ticket.id}</p>
                  <label className='ticketTitle'>
                    <input type='checkbox' className='checkbox-round'></input>
                    {ticket.title}
                  </label>
                  <div className="tag-list">
                    {ticket.tag.map((tag, index) => (
                      <div key={index} className="tag">
                        <span class="dot"></span>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
