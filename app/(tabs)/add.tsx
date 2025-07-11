import TransactionAddScreen from '@/screens/TransactionAddScreen';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';

const AddTab = () => {
    const [key, setKey] = useState(Date.now());

    // Mỗi lần mở lại tab, reset key => ép remount TransactionAddScreen
    useFocusEffect(
        useCallback(() => {
            setKey(Date.now());
        }, [])
    );
    return <TransactionAddScreen key={key} />;
};

export default AddTab;

const styles = StyleSheet.create({});
