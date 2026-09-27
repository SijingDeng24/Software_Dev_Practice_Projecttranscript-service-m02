import {
  type StudentID,
  type Student,
  type Course,
  type CourseGrade,
  type Transcript,
} from './types.ts';

export interface TranscriptService {
  addStudent(studentName: string): StudentID;
  getTranscript(id: StudentID): Transcript; // throws Error if id invalid
  deleteStudent(id: StudentID): void; // throws Error if id invalid
  addGrade(id: StudentID, course: Course, courseGrade: CourseGrade): void;
  getGrade(id: StudentID, course: Course): CourseGrade;
  nameToIDs(studentName: string): StudentID[];
}

export class TranscriptDB implements TranscriptService {
  /** the list of transcripts in the database */
  private _transcripts: Transcript[] = [];

  /** the last assigned student ID
   * @note Assumes studentID is Number
   */
  private _lastID: number;

  constructor() {
    this._lastID = 0;
  }

  /** Adds a new student to the database
   * @param {string} newName - the name of the student
   * @returns {StudentID} - the newly-assigned ID for the new student
   */
  addStudent(newName: string): StudentID {
    const newID = this._lastID;
    this._lastID += 1;
    const newStudent: Student = { studentID: newID, studentName: newName };
    this._transcripts.push({ student: newStudent, grades: [] });
    return newID;
  }

  /**
   * @param studentName
   * @returns list of studentIDs associated with that name
   */
  nameToIDs(studentName: string): StudentID[] {
    return this._transcripts
      .filter(t => t.student.studentName === studentName)
      .map(t => t.student.studentID);
  }

  /**
   *
   * @param id - the id to look up
   * @returns the transcript for this ID
   */
  getTranscript(id: StudentID): Transcript {
    const ret: Transcript | undefined = this._transcripts.find(t => t.student.studentID === id);
    if (ret === undefined) {
      throw new Error('unknown ID');
    } else {
      return ret;
    }
  }

  deleteStudent(id: StudentID): void {
    throw new Error('not implemented yet');
  } // hmm, what to do about errors??

  addGrade(id: StudentID, course: Course, courseGrade: CourseGrade): void {
    throw new Error('not implemented yet');
  }

  getGrade(id: StudentID, course: Course): CourseGrade {
    throw new Error('not implemented yet');
  }

  getAllStudentIDs(): StudentID[] {
    throw new Error('not implemented yet');
  }
}
