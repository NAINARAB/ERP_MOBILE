import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-elements';
import apiAddress from '../api';
import styles from './style';
import { Card, Avatar, IconButton, Dialog, Button as PaperButton, TextInput as TexInpt, Icon, MD3Colors } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
}
function formatTime(inputTime) {
    const [hours, minutes, seconds] = inputTime.split(':');
    const dateObj = new Date(2000, 0, 1, hours, minutes, seconds);
    const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return formattedTime;
}

const HomeComponent = ({ setLoginFalse, navigation }) => {
    const [uName, setUname] = useState('')
    const [uRole, setURole] = useState('');
    const [uType, setUType] = useState('');
    const [token, setToken] = useState('');
    const [uId, setUId] = useState('');
    const [branch, setBranch] = useState('');
    const [SessionId, setSessionId] = useState('');
    const [loginInfo, setLoginInfo] = useState({});
    const [attendance, setAttanance] = useState([])
    const [dialog, setDialog] = useState(false)

    const [taskApp, setTaskApp] = useState(false)
    const [isEmp, setIsEmp] = useState(false)
    const [summary, setSummary] = useState('');
    const [refresh, setRefresh] = useState(false);

    const LeftContent = props => <Avatar.Icon {...props} icon="account" />
    const RightContent = props =>
        <IconButton
            {...props}
            icon="power"
            color='black'
            mode='outlined'
            style={{ marginRight: 10 }}
            onPress={setLoginFalse} />

    const getUser = async () => {
        try {
            const uname = await AsyncStorage.getItem('Name');
            const role = await AsyncStorage.getItem('UserType');
            const token = await AsyncStorage.getItem('userToken');
            const id = await AsyncStorage.getItem('UserId');
            const loginResponse = await AsyncStorage.getItem('loginResponse')
            const branch = await AsyncStorage.getItem('branchId')
            const uType = await AsyncStorage.getItem('uType')
            const parsed = JSON.parse(loginResponse)
            setSessionId(parsed.SessionId)
            setUname(uname); setURole(role); setToken(token); setUId(id);
            setLoginInfo(JSON.parse(loginResponse)); setBranch(branch); setUType(uType)
        } catch (e) {
            console.log(e)
        }
    }

    const getRights = async () => {
        fetch(`${apiAddress}/api/pagerights?menuid=${13}&menutype=${2}&user=${await AsyncStorage.getItem('UserId')}`, {
            headers: {
                "Content-type": "application/json; charset=UTF-8",
                'Authorization': await AsyncStorage.getItem('userToken'),
            }
        })
            .then((res) => res.json())
            .then((data) => {
                setTaskApp(data?.data[0]?.Add_Rights === 1)
            })
    }

    const getEmp = async () => {
        fetch(`${apiAddress}/api/attendance?id=${await AsyncStorage.getItem('UserId')}`, { headers: { 'Authorization': await AsyncStorage.getItem('userToken') } })
            .then(res => { return res.json() })
            .then(data => {
                setAttanance(data.status === 'Success' ? data.data : [])
                setIsEmp(!(data.message === 'Not An Employee'))
            })
    }

    const getLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                const locationResult = await Location.getCurrentPositionAsync({});
                return locationResult.coords
            } else {
                console.log('Location permission denied');
            }
        } catch (error) {
            console.error('Error getting location permission:', error);
            console.log('Error in getLocation:', error);
        }
    };

    useEffect(() => {
        getUser();
        getRights();
        getEmp()
    }, [refresh])

    const dialogClose = () => {
        setDialog(false)
        setSummary('')
    }

    const StartDay = async () => {
        const locationResult = await getLocation();
        if (locationResult?.latitude && locationResult?.longitude) {
            fetch(`${apiAddress}/api/attendance`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: uId,
                    Latitude: locationResult?.latitude,
                    Longitude: locationResult?.longitude,
                    Creater: 'Employee'
                })
            }).then(res => res.json())
                .then(data => {
                    setRefresh(!refresh);
                    if (data.status === 'Success') {
                        alert(data.message);
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error in fetching data:', error);
                });
        } else {
            alert('Location Access Denied');
        }
    };

    const EndDay = () => {
        if (summary) {
            fetch(`${apiAddress}/api/attendance`, {
                method: 'PUT',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    UserId: uId,
                    Work_Summary: summary
                })
            }).then(res => { return res.json() })
                .then(data => {
                    setRefresh(!refresh)
                    if (data.status === 'Success') {
                        alert(data.message)
                        dialogClose(); setRefresh(!refresh);
                    } else {
                        alert(data.message)
                    }
                })
        } else {
            alert('Enter Summary')
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradientContainer2}>

                <Card style={{ borderRadius: 0 }}>
                    <Card.Title
                        title={uName}
                        subtitle={uRole}
                        left={LeftContent}
                        right={RightContent}
                        titleStyle={{ fontSize: 20, fontWeight: 'bold', color: 'blue' }}
                        subtitleStyle={{ width: '70%' }} />
                </Card>

                {isEmp &&
                    <View style={{ padding: 10 }}>

                        <Card>
                            <Card.Title
                                title={'Today Attendance'}
                                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                                subtitleStyle={{ width: '70%' }} />

                            <Divider style={{ backgroundColor: 'black', }} />

                            <Card.Content style={{ marginTop: 10 }}>
                                <View style={styles.textView}>
                                    <Text style={styles.attendanceText1} >Start Date</Text>
                                    <Text style={styles.attendanceText2} >{attendance[0]?.Start_Date ? formatDate(attendance[0]?.Start_Date) : '--:--:--'}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.attendanceText1} >In Time</Text>
                                    <Text style={styles.attendanceText2} >{attendance[0]?.InTime ? formatTime(attendance[0]?.InTime) : '--:--:--'}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.attendanceText1} >Out Time</Text>
                                    <Text style={styles.attendanceText2} >{attendance[0]?.OutTime ? formatTime(attendance[0]?.OutTime) : '--:--:--'}</Text>
                                </View>
                                <View style={styles.textView}>
                                    <Text style={styles.attendanceText1} >Out Date</Text>
                                    <Text style={styles.attendanceText2} >{attendance[0]?.OutDate ? formatDate(attendance[0]?.OutDate) : '--:--:--'}</Text>
                                </View>
                            </Card.Content>

                            <Divider style={{ backgroundColor: 'black', }} />

                            <Card.Actions>
                                {attendance.length > 0 &&
                                    <PaperButton
                                        disabled={(attendance.length > 0) && (attendance[0]?.Current_St === 1)}
                                        onPress={() => setDialog(true)}>End Day</PaperButton>
                                }
                                <PaperButton
                                    onPress={StartDay}
                                    style={{ marginRight: 10 }}
                                    disabled={attendance[0]?.Start_Date ? true : false}>Start Day</PaperButton>
                            </Card.Actions>
                        </Card>
                    </View>
                }

                <View style={{ padding: 10 }}>
                    <Card>
                        <Card.Title
                            title={'SMT Apps'}
                            titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                            subtitleStyle={{ width: '70%' }} />
                        <Card.Content>
                            <View style={styles.roundedView}>
                                <TouchableOpacity
                                    style={styles.IconView}
                                    onPress={() => {
                                        navigation.navigate('WebView', { url: `https://erpsmt.in/?InTime=${loginInfo.InTime}&UserId=${loginInfo.UserId}&username=${uName}&branch=${branch}&uTypeId=${uType}&uTypeGet=${uRole}&userToken=${token}&SessionId=${SessionId}` })
                                    }}>
                                    <Icon
                                        source="finance"
                                        color={MD3Colors.error50}
                                        size={30}
                                    />
                                    <Text>ERP APP</Text>
                                </TouchableOpacity>
                                {taskApp &&
                                    <TouchableOpacity
                                        style={styles.IconView}
                                        onPress={() => {
                                            navigation.navigate('WebView', { url: `https://smttask.in/?InTime=${loginInfo.InTime}&UserId=${loginInfo.UserId}&username=${uName}&branch=${branch}&uType=${uType}` })
                                        }}>
                                        <Icon
                                            source="calendar-check"
                                            color={MD3Colors.error50}
                                            size={26}
                                        />
                                        <Text>TASK APP</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </Card.Content>
                    </Card>
                </View>



            </LinearGradient>
            <Dialog visible={dialog} onDismiss={dialogClose}>
                <Dialog.Title>Close Attendance</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ marginBottom: 5 }}>Day Summary</Text>
                    <TexInpt
                        multiline={true}
                        numberOfLines={5}
                        mode='outlined'
                        onChangeText={(e) => setSummary(e)} />
                </Dialog.Content>
                <Dialog.Actions>
                    <PaperButton mode='elevated' onPress={EndDay} buttonColor='lightgreen'>Submit</PaperButton>
                    <PaperButton mode='elevated' onPress={dialogClose}>Cancel</PaperButton>
                </Dialog.Actions>
            </Dialog>
        </SafeAreaView>
    )
}

export default HomeComponent;