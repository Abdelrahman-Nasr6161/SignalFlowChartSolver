import * as React from 'react';
import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';

import FlowForm from './flow';
import RouthForm from './routh';

export default function TabsVertical() {
    const [value, setValue] = React.useState(0);

    return (
      <Tabs
        aria-label="Vertical tabs"
        orientation="vertical"
        sx={{ minWidth: 300, height: '100vh', padding: '0px' }}
        value={value}
        onChange={(event, newValue) => setValue(newValue)}
      >
        <TabList sx={{ backgroundColor: '#2a273f' }}>
          <Tab sx={{ padding: '15px', color: "#ffffff", fontFamily: "'IBM Plex Mono', monospace" , backgroundColor: '#2a273f', 
                    '&.Mui-selected': { color: '#f6c177' , backgroundColor:"#191724"} }}>
                    Signal Flow Representation
          </Tab>
          <Tab sx={{ padding: '15px', color: "#ffffff", fontFamily: "'IBM Plex Mono', monospace" , backgroundColor: '#2a273f', 
                    '&.Mui-selected': { color: '#f6c177', background:"#191724"} }}>
                    Routh Stability Criterion
          </Tab>
        </TabList>
        <TabPanel value={0} sx={{ padding: '0px' }}>
            <FlowForm />
        </TabPanel>
        <TabPanel value={1} sx={{ padding: '0px' }}>
            <RouthForm />
        </TabPanel>
      </Tabs>
    );
}