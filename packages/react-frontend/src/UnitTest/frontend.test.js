import { render, screen } from "@testing-library-react";
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';


const mainFunctions = require("../main.jsx");
import SearchBar from "../Components/SearchBar.jsx";

test("render search bar with default text ", () => {
    console.log("Hello");
 render(<SearchBar/>);

    const element = screen.getByText(/hi/i);
    expect(element).toBeInTheDocument();
});