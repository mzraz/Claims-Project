import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CustomTextField from '../../../../components/forms/theme-elements/CustomTextField';
import CustomSelect from '../../../../components/forms/theme-elements/CustomSelect';
import { useState } from 'react';

export default function CountrySelect({ countries, formik }) {

    return (
        <Autocomplete
            value={formik.values.countryId || null}
            id="countryId"
            name="countryId"
            onChange={(event, value) => {
                formik.setFieldValue("countryId", value);
            }}
            options={countries}
            sx={{ padding: '0 !important' }}
            autoHighlight
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <img
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.shortLabel.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.shortLabel.toLowerCase()}.png`}
                        alt=""
                    />
                    {option.label} ({option.shortLabel})
                    {/* +{option.phone} */}
                </Box>
            )}
            renderInput={(params) => (
                <CustomTextField
                    {...params}
                   
                    size='small'
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                        style: {
                            height: "27.5px",
                        },

                    }}
                />
                // <div ref={params.InputProps.ref}>
                //     <input type="text" {...params.inputProps} />
                // </div>
            )}
        />
    );
}

// From https://bitbucket.org/atlassian/atlaskit-mk-2/raw/4ad0e56649c3e6c973e226b7efaeb28cb240ccb0/packages/core/select/src/data/countries.js
