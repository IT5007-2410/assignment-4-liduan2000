import React, {useState} from 'react';
import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    Button,
    useColorScheme,
    View,
  } from 'react-native';

  const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

  function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
  }

  async function graphQLFetch(query, variables = {}) {
    try {
        /****** Q4: Start Coding here. State the correct IP/port******/
        const response = await fetch('http://10.0.2.2:3000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
        /****** Q4: Code Ends here******/
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
  
      if (result.errors) {
        const error = result.errors[0];
        if (error.extensions.code == 'BAD_USER_INPUT') {
          const details = error.extensions.exception.errors.join('\n ');
          alert(`${error.message}:\n ${details}`);
        } else {
          alert(`${error.extensions.code}: ${error.message}`);
        }
      }
      return result.data;
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

class IssueFilter extends React.Component {
    render() {
      return (
        <>
        {/****** Q1: Start Coding here. ******/}
        <Text style={{ fontSize: 18, padding: 10 }}>Issue Filter Placeholder</Text>
        {/****** Q1: Code ends here ******/}
        </>
      );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
  });

const width= [40,80,80,80,80,80,200];
function IssueRow(props) {
  const issue = props.issue;
//    {/****** Q2: Coding Starts here. Create a row of data in a variable******/}
  const issueData = [
    issue.id,
    issue.title,
    issue.status,
    issue.owner,
    issue.created ? issue.created.toLocaleDateString() : "not available",
    issue.effort,
    issue.due ? issue.due.toLocaleDateString() : "not available",
  ];
//    {/****** Q2: Coding Ends here.******/}
  return (
//    {/****** Q2: Start Coding here. Add Logic to render a row  ******/}
    <Row
      data={issueData}
      widthArr={width}
      style={styles.row}
      textStyle={styles.text}
    />
//    {/****** Q2: Coding Ends here. ******/}
  );
}


function IssueTable(props) {
  const issueRows = props.issues.map((issue) => (
    <IssueRow key={issue.id} issue={issue} />
  ));
//  {/****** Q2: Start Coding here. Add Logic to initalize table header  ******/}
  const widthArr = [40, 80, 80, 80, 80, 80, 200];
  const header = ['ID', 'Title', 'Status', 'Owner', 'Created', 'Effort', 'Due'];
//  {/****** Q2: Coding Ends here. ******/}
  return (
//  {/****** Q2: Start Coding here to render the table header/rows.**********/}
    <View style={styles.container}>
      <ScrollView horizontal>
        <View>
          <TableWrapper style={{ flexDirection: 'row' }}>
            <Row data={header} widthArr={widthArr} style={styles.header} textStyle={styles.text} />
          </TableWrapper>
          <ScrollView style={styles.dataWrapper}>{issueRows}</ScrollView>
        </View>
      </ScrollView>
    </View>
//  {/****** Q2: Coding Ends here. ******/}
  );
}

  
  class IssueAdd extends React.Component {
    constructor(props) {
      super(props);
      this.handleSubmit = this.handleSubmit.bind(this);
      /****** Q3: Start Coding here. Create State to hold inputs******/
      this.state = { title: '', owner: '', effort: '' };
      /****** Q3: Code Ends here. ******/
    }
  
    /****** Q3: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleTitleChange = (title) => this.setState({ title });
    handleOwnerChange = (owner) => this.setState({ owner });
    handleEffortChange = (effort) => this.setState({ effort });
    /****** Q3: Code Ends here. ******/
    
    handleSubmit() {
      /****** Q3: Start Coding here. Create an issue from state variables and call createIssue. Also, clear input field in front-end******/
        const { title, owner, effort } = this.state;
        const issue = {
            title,
            owner,
            effort: parseInt(effort, 10),
            due: new Date(),
        };
        this.props.createIssue(issue);
        this.setState({ title: '', owner: '', effort: '' });
      /****** Q3: Code Ends here. ******/
    }
  
    render() {
      return (
          <View>
          {/****** Q3: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
              <TextInput placeholder="Title" value={this.state.title} onChangeText={this.handleTitleChange} />
              <TextInput placeholder="Owner" value={this.state.owner} onChangeText={this.handleOwnerChange} />
              <TextInput placeholder="Effort" value={this.state.effort} onChangeText={this.handleEffortChange} />
              <Button title="Add Issue" onPress={this.handleSubmit} />
          {/****** Q3: Code Ends here. ******/}
          </View>
      );
    }
  }

class BlackList extends React.Component {
    constructor(props)
    {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        /****** Q4: Start Coding here. Create State to hold inputs******/
        this.state = { nameInput: '' };
        /****** Q4: Code Ends here. ******/
    }
    /****** Q4: Start Coding here. Add functions to hold/set state input based on changes in TextInput******/
    handleNameInputChange = (nameInput) => this.setState({ nameInput });
    /****** Q4: Code Ends here. ******/

    async handleSubmit() {
    /****** Q4: Start Coding here. Create an issue from state variables and issue a query. Also, clear input field in front-end******/
        const query = `mutation addToBlacklist($nameInput: String!) {
          addToBlacklist(nameInput: $nameInput)
        }`;
        await graphQLFetch(query, { nameInput: this.state.nameInput });
        this.setState({nameInput: '' });
    /****** Q4: Code Ends here. ******/
    }

    render() {
    return (
        <View>
//        {/****** Q4: Start Coding here. Create TextInput field, populate state variables. Create a submit button, and on submit, trigger handleSubmit.*******/}
            <TextInput placeholder="NameInput" value={this.state.nameInput} onChangeText={this.handleNameInputChange} />
            <Button title="Add to Blacklist" onPress={this.handleSubmit} />
//        {/****** Q4: Code Ends here. ******/}
        </View>
    );
    }
}

export default class IssueList extends React.Component {
    constructor() {
        super();
        this.state = { issues: [] };
        this.createIssue = this.createIssue.bind(this);
    }
    
    componentDidMount() {
    this.loadData();
    }

    async loadData() {
    const query = `query {
        issueList {
        id title status owner
        created effort due
        }
    }`;

    const data = await graphQLFetch(query);
    if (data) {
        this.setState({ issues: data.issueList });
    }
    }

    async createIssue(issue) {
    const query = `mutation issueAdd($issue: IssueInputs!) {
        issueAdd(issue: $issue) {
        id
        }
    }`;

    const data = await graphQLFetch(query, { issue });
    if (data) {
        this.loadData();
    }
    }
    
    
    render() {
    return (
    <>
        <IssueFilter />
        <IssueTable issues={this.state.issues} />
        <IssueAdd createIssue={this.createIssue} />
        <BlackList />
//    {/****** Q1: Start Coding here. ******/}
//    {/****** Q1: Code ends here ******/}
//
//
//    {/****** Q2: Start Coding here. ******/}
//    {/****** Q2: Code ends here ******/}
//
//
//    {/****** Q3: Start Coding here. ******/}
//    {/****** Q3: Code Ends here. ******/}
//
//    {/****** Q4: Start Coding here. ******/}
//    {/****** Q4: Code Ends here. ******/}
    </>
      
    );
  }
}
