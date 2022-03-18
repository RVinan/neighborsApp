import React, { Component, useState} from 'react';
import { StyleSheet, Platform, View, ActivityIndicator, FlatList, Text, Image, Pressable, Button, Modal, Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const sitesURL = 'https://s3.amazonaws.com/decom_uploads/external/sites.json';
const Stack = createNativeStackNavigator();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default class App extends Component{

  constructor(props){
    super(props)
    this.state = {
      isLoading: true
    }
  }
  
  //Fetching data from end-point
  webCall = async () => {
    try {
      //loading
      const response = await fetch(sitesURL);
      const responseJson = await response.json();
      this.setState({
        isLoading: false,
        dataSource: responseJson.sites//accessing the array
      },
        function () {
        });
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount () {
    this.webCall()
  }

  //Home screen
  HomeScreen = ({navigation}) => {
    return (
      <View style={styles.MainContainer}>
          <Text style={styles.title}>Neighbors🌃</Text>
          <FlatList
          //getting data
          data = {this.state.dataSource}
          
          //rendering each site from data
          renderItem={({item}) =>
            <Pressable style={styles.itemBox} onPress={() => //whole site container can access details when pressed
               navigation.navigate('Contacts', {params: item})}>
              <Image source={{ uri: item.image }} style={styles.imageView} />
              <View style={styles.siteInfo}>
                <Text style={styles.textView}>
                  {item.name}
                </Text>
                <Text style={styles.subText}>
                  {item.address}
                </Text>
              </View>
            </Pressable>
          }
          />
      </View>
    )
  }

  //site details screen
  ContactsScreen = ({navigation, route}) =>{
    const {params:site} = route.params
    const [modalVisible, setModalVisible] = useState(false);
    console.log(site)
    return(
      <View styles={{flexDirection:'row'}} >
        <Pressable
          
          onPress = {() => 
            navigation.navigate('Home')
          }
          >
            <Text style={styles.backButton}>◀️</Text>
          </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centerComponent}>
          <View>
          <Pressable onPress={() => setModalVisible(!modalVisible)}>
            <Text>❌</Text>
          </Pressable>
          <Image source={{ uri: site.image }} style={styles.imageBig} />
          </View>
        </View>
      </Modal>
          
          <View style={{flexDirection:'row', flex: 1, marginLeft:24}}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Image source={{ uri: site.image }} style={styles.imageDetail} />
            </Pressable>
            <View style={{flexDirection:'column', flex: 1, marginTop:8}}>
              <View style={styles.infoSeparator}>
                <Text style={styles.boldText}>Name:</Text>
                <Text>{site.name}</Text>
              </View>
              <View style={{marginHorizontal:12}}>
                <Text style={styles.boldText}>Main Contact:</Text>
                {!!site.contacts.length == 0 && <Text>No contact available</Text>}
                <Text>{site.contacts[0]?.name}</Text>
              </View>              
            </View>
          </View>
        
        <View style={{flexDirection:'column', flex: 1, marginHorizontal:40}}>
          <View style={{marginVertical:20}}>
            <Text style={styles.boldText}>Address:</Text>
            <Text>{site.address}</Text>
          </View>        

          <View style={{marginVertical:20}}>
            {!!site.contacts[0] && <Text style={styles.boldText}>Phone:</Text>}
            <View style={{flexDirection:'row'}}>
              <Text style={styles.dataInSidesLeft}>
                {site.contacts[0]?.phone}
              </Text>
              {!!site.contacts[0]?.phone && <Text style={styles.dataInSidesRight}>Main</Text>}
            </View>
            <Text>{site.contacts[0]?.phone_home} {!!site.contacts[0]?.phone_home && <Text>Home</Text>}</Text>
          </View>          

          <View style={{marginVertical:20}}>
            {!!site.contacts.length != 0 && <Text style={styles.boldText}>Email:</Text>}
            <Text>{site.contacts[0]?.email}</Text>
          </View>
          
        </View>

        <View style={styles.centerComponent}>
          <View style={styles.otherContacts}>
            <View style={styles.otherContactsTitle}>
              <Text style={styles.boldText}>Other Contacts:</Text>
            </View>
            
            {!!site.contacts.length == 0 && <Text>No other contacts</Text>}
            {site.contacts.map((contact, i) => {
              if(!i) return null
              return (<View style={{flexDirection:'row'}} key={i}>
              <Text style={styles.dataInSidesLeft}>{contact.name} </Text>
              <Text style={styles.dataInSidesRight}>{contact.phone}</Text>
              </View>)
            })}
          </View>
        </View>
      </View>
    )
  }

  render () {
    if (this.state.isLoading) {
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
 
         <ActivityIndicator size="large" />
 
       </View>
      )
    }
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen
            name="Home"
            component={this.HomeScreen}
            options={{header:() => {}}}
          />
          <Stack.Screen
            name="Contacts"
            component={this.ContactsScreen}
            options={{header:() => {}}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

const styles = StyleSheet.create({
  MainContainer :{ 
    justifyContent: 'center',
    flex:1,
    margin:4,
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
    margin: 12
  },
  
  boldText: {
    fontWeight:'700',
  },

  imageView: {  
    width: '40%',
    height: 120,
    margin: 8,
    borderRadius: 10
  },

  nameMain: {
    flexDirection: 'row'
  },

  siteInfo:{
    flexDirection: 'column',
    padding: 10,
  },

  imageDetail: {
    width: 160,
    height: 160,
    marginTop: 8,
    marginLeft: 8,
    borderRadius: 10
  },

  imageBig: {
    height: windowHeight*0.8,
    width: windowWidth*0.96
  },
  
  textView: {  
    width:'100%', 
    textAlignVertical:'center',
    color: '#fff',
    fontSize: 16,
  
  },

  itemBox: {
    width: "96%",
    backgroundColor: '#194a8d',
    flex:1,
    flexDirection: 'row',
    margin: 4,
    borderRadius: 10
  },

  subText: {
    fontSize: 12,
    color: '#a8c6ef',
    fontStyle: 'italic',
    width: '90%',
    marginTop:16
  },

  backButton: {
    width: windowWidth*0.88,
    fontSize:32,
    paddingTop:32,
    paddingBottom: 12,
    marginLeft:20,
    marginBottom:8,
    textAlign:'left',
    borderBottomWidth: 1,
    borderColor:'#444'

  },

  infoSeparator: {
    marginHorizontal:12,
    marginBottom:20
  },

  otherContactsTitle: {
  backgroundColor:'#518de0'
  },

  otherContacts: {
    width: windowWidth*0.88,
    height:120,
    flexDirection:'column',
    marginTop:100,
    borderColor: '#444',
    borderWidth: 2
  },

  centerComponent: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  dataInSidesRight: {
    textAlign:'right', flexBasis:'50%'
  },

  dataInSidesLeft: {
    textAlign:'left', flexBasis:'50%'
  }
});
