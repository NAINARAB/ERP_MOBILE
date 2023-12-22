import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 25,
    },
    label: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 5,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 4,
        padding: 10,
        marginBottom: 15,
        minWidth: 250,
    },
    card: {
        paddingHorizontal: 25,
        paddingVertical: 30,
        backgroundColor: 'white',
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    gradientContainer2: {
        flex: 1,
    },
    textView: {
        display: 'flex',
        flexDirection: 'row',
    },
    attendanceText1: {
        width: '50%',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        padding: 10,
    },
    attendanceText2: {
        width: '50%',
        fontSize: 16,
        textAlign: 'right',
        fontWeight: 'bold',
        color: 'black',
        padding: 10,
    },
    roundedView: {
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 2,
    },
    IconView: {
        height: 80,
        width: 80,
        borderRadius: 10,
        backgroundColor: '#f2f2f2',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },

})

export default styles;