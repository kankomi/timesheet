import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';

import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect, isLoaded } from 'react-redux-firebase';

import moment from 'moment';
import 'moment/locale/de';

import { setTime, deleteTime } from '../actions/timeSheetActions';

function objectMap(object, mapFn) {
  return Object.keys(object).reduce(function(result, key) {
    result[key] = mapFn(object[key]);
    return result;
  }, {});
}

class Timesheet extends Component {
  state = { currentDate: moment(), rows: null };

  constructor(props) {
    super(props);
    moment.locale('de');
  }

  componentDidMount() {
    this.createDays();
  }

  createDays = () => {
    const { currentDate } = this.state;
    const curMonth = currentDate.month();
    const tempDate = moment([currentDate.year(), currentDate.month(), 1]);
    let rows = [];

    while (tempDate.month() === curMonth) {
      const row = {
        date: tempDate.clone()
      };

      rows.push(row);
      tempDate.add(1, 'days');
    }

    this.setState({ ...this.state, rows });
  };

  getTotal = date => {
    const from = this.getValue(date, 'from');
    const to = this.getValue(date, 'to');

    if (from && to) {
      from.set('date', to.date());
      from.set('month', to.month());
      from.set('year', to.year());

      const h = Math.round(to.diff(from, 'hours', true) * 100) / 100;
      return `${h} Stunden`;
    }

    return '';
  };

  handleChange = async (idx, id, date) => {
    let rows = this.state.rows;
    rows[idx][id] = date;

    const { from, to } = rows[idx];
    const { auth } = this.props;

    if (from && to) {
      rows[idx].total = Math.round(to.diff(from, 'hours', true) * 10) / 100;
      // moment.duration(breakTo.diff(breakFrom, 'hours', true));
    }

    const entry = objectMap(rows[idx], val => {
      return moment.isMoment(val) ? val.toDate() : val;
    });

    entry.user = auth.uid;

    const dbId = this.getValue(this.state.rows[idx].date, 'id');
    if (dbId) {
      this.props.firestore.update(
        { collection: 'timesheet', doc: dbId },
        entry
      );
    } else {
      const docRef = await this.props.firestore.add('timesheet', entry);
      rows[idx].id = docRef.id;
      this.setState({ ...this.state, rows });
    }

    this.setState({ ...this.state, rows });
  };

  getValue = (date, id) => {
    const { timesheet } = this.props;
    if (!timesheet) {
      return null;
    }

    const vals = timesheet.filter(val =>
      moment(val.date.seconds * 1000).isSame(date, 'day')
    );
    if (vals && vals.length > 0 && vals[0][id]) {
      const obj = vals[0][id];
      if (typeof obj === 'object' && obj.hasOwnProperty('seconds')) {
        return moment(obj.seconds * 1000);
      }
      return obj;
    }

    return null;
  };

  renderRows = () => {
    let rows = [];
    if (!this.state.rows) {
      return;
    }
    this.state.rows.forEach((row, idx) => {
      rows.push(
        <tr key={idx}>
          <td>
            <div className="d-flex justify-content-between">
              <span>{row.date.format('ddd,')}</span>
              <span>{row.date.format('D. MMM')}</span>
            </div>
          </td>
          <td>
            <DatePicker
              selected={this.getValue(row.date, 'from')}
              onChange={date => this.handleChange(idx, 'from', date)}
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              timeCaption="Zeit"
              placeholderText="HH:mm"
              className="form-control time-input"
              disabled={!isLoaded()}
            />
          </td>
          <td>
            <div className="d-flex align-items-center justify-content-between">
              <DatePicker
                selected={this.getValue(row.date, 'breakFrom')}
                onChange={date => this.handleChange(idx, 'breakFrom', date)}
                showTimeSelect
                showTimeSelectOnly
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                timeCaption="Zeit"
                placeholderText="HH:mm"
                className="form-control time-input-sm mr-1"
              />
              <span>-</span>
              <DatePicker
                selected={this.getValue(row.date, 'breakTo')}
                onChange={date => this.handleChange(idx, 'breakTo', date)}
                showTimeSelect
                showTimeSelectOnly
                dateFormat="HH:mm"
                timeFormat="HH:mm"
                timeCaption="Zeit"
                placeholderText="HH:mm"
                className="form-control time-input-sm"
              />
            </div>
          </td>
          <td>
            <DatePicker
              selected={this.getValue(row.date, 'to')}
              onChange={date => this.handleChange(idx, 'to', date)}
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH:mm"
              timeFormat="HH:mm"
              timeCaption="Zeit"
              placeholderText="HH:mm"
              className="form-control  time-input"
            />
          </td>
          <td>{`${this.getTotal(row.date)}`}</td>
        </tr>
      );
    });

    return rows;
  };

  render() {
    const { currentDate } = this.state;

    return (
      <div className="mt-4 container">
        <div className="container-fluid">
          <div className="row align-items-center">
            <h2 className="col font-weight-light">
              {currentDate.format('MMMM YYYY')}
            </h2>
            <h5 className="col">Erfassung der Arbeitszeit</h5>
            <h5 className="col">
              Zeitraum: {currentDate.format('01.MM.YYYY')} bis{' '}
              {currentDate.format(`${currentDate.daysInMonth()}.MM.YYYY`)}
            </h5>
          </div>
          <div className="row">
            <div className="col-4" />
            <h5 className="col">
              Name: <span className="font-weight-bold">Lena Merschformann</span>
            </h5>
          </div>
        </div>

        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th>Datum</th>
              <th>Arbeitszeit Anfang</th>
              <th>Pause (von bis)</th>
              <th>Arbeitszeit Ende</th>
              <th>Arbeitszeit (ohne Pausen)</th>
            </tr>
          </thead>
          <tbody>{this.renderRows()}</tbody>
        </table>
      </div>
    );
  }
}

export default compose(
  firestoreConnect((state, props) => [{ collection: 'timesheet' }]),
  connect((state, props) => ({
    timesheet: state.firestore.ordered.timesheet,
    auth: state.firebase.auth,
    ...{ deleteTime, setTime }
  }))
)(Timesheet);

Timesheet.contextTypes = {
  store: PropTypes.object
};
