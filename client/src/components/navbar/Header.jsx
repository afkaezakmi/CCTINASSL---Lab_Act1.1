import React from 'react'

function Header() {
  return (
    <>
    <header>
            <a href="#"><img src="https://raw.githubusercontent.com/farazc60/Project-Images/main/starbucks/logo.png" class="logo"/></a>
            <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">Menu</a></li>
                <li><a href="#">What's New</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="./pages/About.jsx">About us</a></li>
            </ul>
        </header>
    </>
  )
}

export default Header