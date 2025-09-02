import { Box, CircularProgress, Typography } from '@mui/material'
import { Component } from 'react'

type Props = {}

type State = {}

export default class Loading extends Component<Props, State> {
    state = {}

    render() {
        return (
            <Box sx={{ display: 'flex' }}>
                <Typography variant="h6" sx={{ marginRight: 2 }}>Loading...</Typography>
                <CircularProgress  />
            </Box>
        )
    }
}