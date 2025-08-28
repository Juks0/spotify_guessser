import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={{ padding: '1rem', background: '#282c34' }}>
            <NavLink
                to="/me"
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Me
            </NavLink>
            <NavLink
                to="/top-artists"
                style={({ isActive }) => ({
                    marginRight: '1rem',
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Top Artists
            </NavLink>
            <NavLink
                to="/top-tracks"
                style={({ isActive }) => ({
                    color: isActive ? 'yellow' : 'white',
                    textDecoration: 'none',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                Top Tracks
            </NavLink>
        </nav>
    );
};

export default Navbar;
