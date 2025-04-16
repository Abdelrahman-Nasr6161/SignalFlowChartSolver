import React, { useState } from "react";
import { Textarea, Button, Table } from "@mui/joy";
import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';

function RouthForm() {

    const [polynomial, setPolynomial] = useState();
    const [result, setResult] = useState(null);

    const submitRouth = async (e) => {
        e.preventDefault();
        let data = { polynomial: polynomial };
        const response = await fetch("http://127.0.0.1:5000/routh", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            const result = await response.json();
            setResult(result);
            console.log(result);
        }
        else {
            console.error("Error:", response.statusText);
        }
        setPolynomial("");
        console.log("Routh-Hurwitz calculation submitted.");
    };

    return (
        <form 
        className="input" 
        style={{
            backgroundColor: "#191724",
            height: "100%",
            width: "100%",
            color: "#ffffff",
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            overflow: "scroll",
            fontFamily: "'IBM Plex Mono', monospace" 
          }}>
            <p>Enter the characteristic polynomial:</p>
            <Textarea 
                style={{ fontFamily: "'IBM Plex Mono', monospace" }} //
                placeholder="e.g. s^2 + 5*s - 4" rows={5} 
                value={polynomial}
                onChange={(e) => setPolynomial(e.target.value)}
            />

            <div style={{marginTop: "20px"}}>
                <Button 
                    onClick={submitRouth} 
                    variant="solid" 
                    style={{color: "#f6c177", background: "#074f5c", fontFamily: "'IBM Plex Mono', monospace" }} >
                    Calculate
                </Button>
            </div>

            {result && (
                <div style={{ marginTop: "20px", color: "#ffffff", width: "100%" }}>
                    <h3>Result:</h3>
                    <Table variant="soft" style={{ width: "60%", borderCollapse: "collapse"}}>
                        <tbody>
                            {result.routh.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td style={{ border: "1px solid #ffffff", padding: "8px", textAlign: "center" }}>
                                        {"s^" + (result.routh.length - rowIndex - 1)}
                                    </td>
                                    {row.map((value, colIndex) => (
                                        <td key={colIndex} style={{ border: "1px solid #ffffff", padding: "8px", textAlign: "center" }}>
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h2>Number of roots in the right half-plane: {result.RHS_roots_num}</h2>
                    <h2>Number of roots in the left half-plane: {result.LHS_roots_num}</h2>
                    <h2>Number of roots on the imaginary axis: {result.Jw_axis_roots_num}</h2>
                    <h2 style={{color: "#f6c177", fontFamily: "'IBM Plex Mono', monospace" }}>System Stability: {result.stable?"Stable":"Unstable"}</h2>

                </div>
            )}
        </form>
    );
}

export default RouthForm;