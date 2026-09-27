import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';
import type { CourseGrade } from './types.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});

describe('addGrade', () => {
  it('the user can add a new grade for an existing student', () => {
    const id1 = db.addStudent('sue');
    const courseGrade: CourseGrade = { course: 'CS453', grade: 90 };
    db.addGrade(id1, courseGrade.course, courseGrade);
    expect(db.getGrade(id1, 'CS453')).toEqual(courseGrade);
  });
  it('getGrade result should match the grade that was added for the student', () => {
    const id1 = db.addStudent('Bob');
    const courseGrade: CourseGrade = { course: 'CS453', grade: 90 };
    db.addGrade(id1, courseGrade.course, courseGrade);
    expect(db.getGrade(id1, 'CS453').grade).toEqual(90);
  });
  it('should allow adding different grades for different course of the same student', () => {
    const id1 = db.addStudent('Bob');
    const courseGrade1: CourseGrade = { course: 'CS453', grade: 90 };
    const courseGrade2: CourseGrade = { course: 'CS440', grade: 98 };
    db.addGrade(id1, courseGrade1.course, courseGrade1);
    db.addGrade(id1, courseGrade2.course, courseGrade2);
    expect(db.getGrade(id1, 'CS453')).toEqual(courseGrade1);
    expect(db.getGrade(id1, 'CS440')).toEqual(courseGrade2);
  });
  it('the user cannot add a new grade for a non-existing student', () => {
    const courseGrade: CourseGrade = { course: 'CS4530', grade: 90 };
    const invalidId = 9999;
    expect(() => db.addGrade(invalidId, courseGrade.course, courseGrade)).toThrowError();
  });
  it('the user should be able to overwrite/change the grade for a course of the student', () => {
    const id1 = db.addStudent('Bob');
    const courseGrade1: CourseGrade = { course: 'CS453', grade: 90 };
    const updateGrade: CourseGrade = { course: 'CS453', grade: 93 };
    db.addGrade(id1, courseGrade1.course, courseGrade1);
    db.addGrade(id1, updateGrade.course, updateGrade);
    expect(db.getGrade(id1, 'CS453').grade).toEqual(93);
  });
});
