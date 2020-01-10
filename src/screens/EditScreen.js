/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable camelcase */
import React from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Text,
} from 'react-native'

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.navigation.state.params.item.Id,
      accessToken: this.props.navigation.state.params.accessToken,
      apiUrl: this.props.navigation.state.params.item.attributes.url,
      Part_Name__c: this.props.navigation.state.params.item.Part_Name__c,
      Warehouse_Name__c: this.props.navigation.state.params.item.Warehouse_Name__c,
      Job_Number__c: this.props.navigation.state.params.item.Job_Number__c,
      SF_ST_Name_Formula__c: this.props.navigation.state.params.item.SF_ST_Name_Formula__c,
      Quantity__c: this.props.navigation.state.params.item.Quantity__c,
      isSaving: false,
    }
  }

  async getToken() {
    let response = await fetch(
      'https://test.salesforce.com/services/oauth2/token?password=singer@1234YxYMFHUQDxlS1h1uWgRGgXCn&client_secret=D2DCBC1360B6A983AAB7B7C8543BB90C8E60AA831B15D965CB6D5DC8D07CCDB9&client_id=3MVG9e2mBbZnmM6k4u_xbE0sSAFcj6BvAVUD4a2NO8po_PUhOQNTf9ZjDHcz7thhGuIrEP.bI33.sU7tP_xsx&username=nksahay-dkgu@force.com.sandbox&grant_type=password',
      {
        method: 'POST',
      }
    )
    response = await response.json()
    console.log('ACCESS RESPONSE', response)
    let accessToken = response.access_token
    response = await fetch(
      'https://singer--sandbox.my.salesforce.com/services/data/v45.0/query/?q=select+id,Part_Name__c,Spare_NAV_Code__c,Warehouse_Name__c,Job_Number__c,SF_ST_Name_Formula__c,Quantity__c+from+Spare_Part_Centre_Order__c',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    response = await response.json()
    console.log('DATA RESPONSE', response)
    this.setState({ data: response.records })
  }

  onChangePart(text) {
    this.setState({ Part_Name__c: text })
  }
  onChangeWare(text) {
    this.setState({ Warehouse_Name__c: text })
  }
  onChangeJob(text) {
    this.setState({ Job_Number__c: text })
  }
  onChangeSf(text) {
    this.setState({ SF_ST_Name_Formula__c: text })
  }
  onChangeQuan(text) {
    this.setState({ Quantity__c: text })
  }

  onEdit = async () => {
    let { apiUrl, Quantity__c, accessToken } = this.state
    if (Quantity__c === null) {
      Quantity__c = ''
    }
    this.setState({ isSaving: true })
    await fetch(`https://singer--sandbox.my.salesforce.com${apiUrl}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Quantity__c,
      }),
    })
    this.setState({ isSaving: false })
    this.props.navigation.state.params.updateItem(
      this.props.navigation.state.params.item.Id,
      Quantity__c
    )
  }

  renderButton(text, callBackFunc) {
    if (this.state.isSaving) {
      return <ActivityIndicator style={{ marginTop: 40 }} color="#0000ff" />
    }

    return (
      <TouchableOpacity style={styles.login} onPress={callBackFunc}>
        <Text style={{ color: '#FFF' }}>{text}</Text>
      </TouchableOpacity>
    )
  }

  render() {
    const {
      Part_Name__c,
      Warehouse_Name__c,
      Job_Number__c,
      SF_ST_Name_Formula__c,
      Quantity__c,
    } = this.state
    return (
      <View style={styles.mainView}>
        <TextInput
          style={styles.text}
          placeholder="Part Name"
          editable
          onChangeText={(text) => this.onChangePart(text)}
          value={`${Part_Name__c}`}
        />
        <TextInput
          style={styles.text}
          editable
          placeholder="Warehouse Name"
          onChangeText={(text) => this.onChangeWare(text)}
          value={`${Warehouse_Name__c}`}
        />
        <TextInput
          style={styles.text}
          placeholder="Job Number"
          editable
          onChangeText={(text) => this.onChangeJob(text)}
          value={Job_Number__c}
        />
        <TextInput
          style={styles.text}
          placeholder="SF ST Name"
          editable
          onChangeText={(text) => this.onChangeSf(text)}
          value={`${SF_ST_Name_Formula__c}`}
        />
        <TextInput
          style={styles.text}
          editable
          onChangeText={(text) => this.onChangeQuan(text)}
          placeholder="Quantity"
          value={`${Quantity__c}`}
        />
        <View style={{ flex: 1 / 2, alignItems: 'center' }}>
          {this.renderButton('Save', this.onEdit)}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    backgroundColor: '#63B496',
    borderRadius: 10,
    marginTop: 30,
    paddingHorizontal: 40,
    paddingVertical: 10,
  },
  mainView: {
    backgroundColor: '#FFF',
    flex: 1,
    padding: 10,
  },
  text: {
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 0.25,
    fontSize: 18,
    marginVertical: 5,
    padding: 10,
  },
})
