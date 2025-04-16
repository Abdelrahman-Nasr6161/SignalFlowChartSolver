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
        if (polynomial.length === 0) {
            alert("Please enter a polynomial.");
            return
        }
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
                style={{ fontFamily: "'IBM Plex Mono', monospace"}} //
                placeholder="e.g. s^2 + 5*s - 4" rows={8} columns={3}
                value={polynomial}
                onChange={(e) => setPolynomial(e.target.value)}
                word-break="break-word"
                whiteSpace="pre-wrap"
                overflow-wrap="break-word"
            />

            <div style={{marginTop: "20px"}}>
                <Button 
                    onClick={submitRouth} 
                    variant="solid" 
                    style={{color: "#f6c177", background: "#31748f", fontFamily: "'IBM Plex Mono', monospace" }} >
                    Calculate
                </Button>
            </div>

            {result && (
                <div style={{ marginTop: "20px", color: "#ffffff", width: "100%", display : "flex",justifyContent :"center",flexDirection:"column",alignItems:"center",height:'300vh'}}>
                    <h3>Result:</h3>
                    <Table 
                        variant="soft" 
                        borderAxis="bothBetween"
                        style={{ width: "60%", borderCollapse: "collapse", backgroundColor: "transparent"}}
                        >
                        <tbody>
                            {result.routh.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td style={{ padding: "8px", textAlign: "center" , color: "#f6c177" , fontFamily: "'IBM Plex Mono', monospace", font:"bold" }}>
                                <b>{"S^" + (result.routh.length - rowIndex - 1)}</b>
                                </td>
                                {row.map((value, colIndex) => (
                                <td key={colIndex} style={{ padding: "8px", textAlign: "center" , background :"#2a273f", color: "#FFFFFF" , fontFamily: "'IBM Plex Mono', monospace" }}>
                                    {value}
                                </td>
                                ))}
                            </tr>
                            ))}
                        </tbody>
                    </Table>
                    <h3 style={{fontFamily: "'IBM Plex Mono', monospace" }}>System Stability:<span style={{color : "#f6c177"}}> {result.stable}</span></h3>
                    <h3 style={{margin:"0"}}>Number of roots in the right half-plane: <span style={{color : "#f6c177"}}>{result.RHS_roots_num}</span></h3>
                    <h3 style={{margin:"0"}}>Number of roots in the left half-plane: <span style={{color : "#f6c177"}}>{result.LHS_roots_num}</span></h3>
                    <h3 style={{margin:"0"}}>Number of roots on the imaginary axis: <span style={{color : "#f6c177"}}>{result.Jw_axis_roots_num}</span></h3>
                    {result.RHS_roots.length>0 && (
                        <div>
                            <h3 style={{color: "#ffffff", fontFamily: "'IBM Plex Mono', monospace" }}>Roots in the right half-plane:</h3>
                            <ul style={{listStyleType: "square"}}>
                                {result.RHS_roots.map((root, index) => (
                                    <li key={index} style={{color: "#f6c177"}}>{root}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.LHS_roots.length>0 && (
                        <div>
                            <h3 style={{color: "#ffffff", fontFamily: "'IBM Plex Mono', monospace" }}>Roots in the left half-plane:</h3>
                            <ul style={{listStyleType: "square"}}>
                                {result.LHS_roots.map((root, index) => (
                                    <li key={index} style={{color: "#f6c177"}}>{root}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.Jw_axis_roots.length>0 && (
                        <div>
                            <h3 style={{color: "#ffffff", fontFamily: "'IBM Plex Mono', monospace" }}>Roots on the imaginary axis:</h3>
                            <ul style={{listStyleType: "square"}}>
                                {result.Jw_axis_roots.map((root, index) => (
                                    <li key={index} style={{color: "#f6c177"}}>{root}</li>
                                ))}
                            </ul>
                        </div>           
            )}
                    

                </div>
            )}
        </form>
    );
}

export default RouthForm;