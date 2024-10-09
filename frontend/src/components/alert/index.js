import React from 'react'
import {Alert, AlertIcon} from '@chakra-ui/react'

export default function AlertNotif({status: message}) {
    if(success === true) {
        return (
            <Alert status='success' variant="left-accent" borderRadius={'md'}>
                <AlertIcon/>
                {message}
            </Alert>
        )
    } else if (success === false) {
        return (
            <Alert status='error' variant='left-accent' borderRadius={'md'}>
                <AlertIcon/>
                {message}
            </Alert>
        )
    }
}