import { Fragment, useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { Grid, Button, Typography } from '@mui/material';
import './css/App.css';
import uischema from './uischema.json';
import {
  materialCells,
  materialRenderers,
} from '@jsonforms/material-renderers';

import LocationControl from './LocationControl';
import locationControlTester from './locationControlTester';

import { styled } from '@mui/material/styles';
import Select from 'react-select';
import { Text } from 'react-native';
import slugify from 'react-slugify';
import React from 'react';

const Container = styled(Grid)(({ theme }) => ({
  padding: '1em',
  width: '100%',
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  padding: '0.25em',
}));

const DataContent = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25em',
  backgroundColor: '#cecece',
  marginBottom: '1rem',
  padding: '1rem',
  width: '100%',
  minHeight: '20em',
}));

const DataValidation = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25em',
  backgroundColor: '#cecece',
  marginBottom: '1rem',
  padding: '1rem',
}));

const ButtonLayout = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  borderRadius: '0.25em',
  marginBottom: '1rem',
  padding: '1rem',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: 'auto',
  display: 'block',
}));

const Form = styled('div')(({ theme }) => ({
  margin: 'auto',
  padding: '1rem',
}));

//    Req. Parameters
//initial Data of the jsonform
const initialData = {};
//initla errors
let initialErrors: Array<{ message: string, dataPath: string }> = [];

//    Renderer set
const renderers = [
  ...materialRenderers,
  //register custom renderers
  { tester: locationControlTester, renderer: LocationControl },
];

//    Forms App
const App = () => {
  const [apiVersion, setApiVersion] = useState("");

  //fetching current api schema
  const [schema, setSchema] = useState({});
  const fetchSchema = () => {
    fetch("https://raw.githubusercontent.com/freifunk/api.freifunk.net/master/specs/current")
      .then(response => response.text())
      .then(data => {
        fetch("https://raw.githubusercontent.com/freifunk/api.freifunk.net/master/specs/" + data)
          .then(response => response.json())
          .then(data => {
            // Fix any problematic regex patterns
            fixSchemaRegex(data);
            setSchema(data);
            setApiVersion(data.properties.api.default);
          })
          .catch(() => {
            console.log("NetworkError: Can't fetch the api schema file")
          })
      })
  }
  useEffect(() => {
    fetchSchema();
  }, [])

  // Helper function to fix regex patterns
  const fixSchemaRegex = (schema: any) => {
    // Recursively find and fix all regex patterns
    const processObject = (obj: any) => {
      if (!obj || typeof obj !== 'object') return;
      
      if (obj.pattern && typeof obj.pattern === 'string') {
        // Replace problematic pattern
        if (obj.pattern.includes('\\.\\_\\-') || obj.pattern.includes('\\.\\-\\_')) {
          obj.pattern = obj.pattern.replace('\\.\\_\\-', '\\._-').replace('\\.\\-\\_', '\\._-');
        }
      }
      
      // Process all properties and array items
      Object.values(obj).forEach(value => {
        if (typeof value === 'object' && value !== null) {
          processObject(value);
        }
      });
    };
    
    processObject(schema);
  };

  // const classes = useStyles();  //for user defined css styles

  //    Form data hooks
  const [displayDataAsString, setDisplayDataAsString] = useState('');
  const [jsonformsData, setJsonformsData] = useState<any>(initialData);

  useEffect(() => {
    jsonformsData.api = apiVersion;
    setDisplayDataAsString(JSON.stringify(jsonformsData, null, 2));
  }, [jsonformsData, apiVersion]);


  //   FormsData functions
  //To clear the form data
  const clearData = () => {
    setJsonformsData({});
  };

  //    Validation Error Hooks
  const [validationErrors, setValidationErrors] = useState(initialErrors);

  //  ValidationErrors Functions
  //to record the errors from event emmiter
  let recordErrors = (errors: any) => {
    setValidationErrors(errors);
  }

  //creating a refernce for validation error div
  const errorToFocus = React.createRef<HTMLDivElement>();

  //to validate the data and generate the json file
  let generateFile = async () => {
    if (validationErrors.length === 0 && Object.keys(jsonformsData).length !== 0) {
      const fileName = slugify(jsonformsData.name);
      let fileData = jsonformsData;
      fileData.api = apiVersion;
      const json = JSON.stringify(jsonformsData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return console.log("generated");
    }
    if (errorToFocus.current) errorToFocus.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    console.log("Can't generate");
  }

  //fetching all the API files
  const [comminutiesFiles, setCommunitiesFiles] = useState([]);
  const fetchCommunities = () => {
    fetch("https://raw.githubusercontent.com/freifunk/directory.api.freifunk.net/master/directory.json")
      .then(response => response.json())
      .then(data => setCommunitiesFiles(data))
      .catch(() => console.log("NetworkError: Can't fetch the api file"))
  }
  useEffect(() => {
    fetchCommunities();
  }, [])

  //list of communities to select
  const communities: Array<{ value: string, label: string }> = []
  Object.keys(comminutiesFiles).sort().forEach((comm) => {
    communities.push({ value: comm, label: comm })
  })

  //to update the location
  const correctLocation = (data: any) => {
    if (!data.location)
      return data;

    if (!data.location.geoCode) {
      data.location.geoCode = { lat: data.location.lat, lon: data.location.lon }
      delete data.location.lon;
      delete data.location.lat;
      //check all the additional location
      if (!data.location.additionalLocations)
        return data;

      data.location.additionalLocations.forEach((add: any) => {
        if (add.geoCode)
          return
        add.geoCode = { lat: add.lat, lon: add.lon }
        delete add.lat;
        delete add.lon;
      });
      return data;
    }

    return data;
  }

  const correctCaseSensitivity = (data: any) => {

    if (!data.location.address)
      return data

    if (data.location.address.Name) {
      data.location.address.name = data.location.address.Name;
      delete data.location.address.Name;
    }

    if (data.location.address.Street) {
      data.location.address.street = data.location.address.Street;
      delete data.location.address.Street;
    }


    if (data.location.address.Zipcode) {
      data.location.address.zipcode = data.location.address.Zipcode;
      delete data.location.address.Zipcode;
    }

    return data;
  }

  //to load the data into the form
  let loadData = (community: any) => {
    // console.log(community.value)
    fetch("https://freifunk.net/api/generator/php-simple-proxy/ba-simple-proxy.php?url=" + comminutiesFiles[community.value])
      .then(response => response.json())
      .then(data => {
        data = correctLocation(data.contents);
        data = correctCaseSensitivity(data);
        setJsonformsData(data);
      })
  }

  return (
    <Fragment>
    <div className='App'>
    </div>

    <Container container justifyContent="center" spacing={1}>
      <Grid item sm={5}>
        <StyledTitle variant="h3">
          Load Data
        </StyledTitle>

        <Container>
          <Select
            options={communities}
            onChange={community => loadData(community)}
          />
        </Container>

        <StyledTitle variant="h3">
          Your API file
        </StyledTitle>
        <DataContent>
          <textarea 
            disabled 
            id='boundData'
            value={displayDataAsString}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '20em',
              resize: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'monospace'
            }}
          />
        </DataContent>

        <ButtonLayout>
          <StyledButton
            onClick={clearData}
            color='primary'
            variant='contained'
          >
            Clear data
          </StyledButton>
        </ButtonLayout>

        <div ref={errorToFocus}>
          <StyledTitle variant="h3">
            Validation
          </StyledTitle>

          <DataValidation>
            <Text>{validationErrors.map(d => <li key={d.dataPath}>{d.dataPath}:{d.message}</li>)}</Text>
          </DataValidation>
        </div>
      </Grid>

      <Grid item sm={7}>
        <StyledTitle variant="h3">
          Generator form
        </StyledTitle>
        <Form>
          <StyledButton
            onClick={generateFile}
            color='primary'
            variant='contained'
          >
            Generate API FILE
          </StyledButton>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={jsonformsData}
            renderers={renderers}
            cells={materialCells}
            validationMode={"ValidateAndShow"}
            onChange={({ errors, data }) => {
              setJsonformsData(data);
              recordErrors(errors);
              if (Object.keys(jsonformsData).length === 0) recordErrors([]);
            }}
          />
        </Form>
      </Grid>
    </Container>
  </Fragment>
  );
};

export default App;
