import { useState } from "react";
import IslandActionBar from "../components/IslandActionBar";
import IslandMainDash from "../components/IslandMainDash";
import IslandNavbar from "../components/IslandNavbar";
import DarkTest from "../components/DarkTest";

export default function StudentIsland() {
    return (
        <>
            <IslandNavbar />
            <IslandMainDash />
            {/* <DarkTest /> */}
        </>
    )
}