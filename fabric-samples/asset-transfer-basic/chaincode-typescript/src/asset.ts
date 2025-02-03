/*
  SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
export class Asset {
    @Property()
    public docType?: string = 'certificate';  // Defines the type of asset

    @Property()
    public certificateID: string = '';  // Unique Certificate Identifier

    @Property()
    public studentName: string = '';  // Student's Name

    @Property()
    public university: string = '';  // Issuing University

    @Property()
    public department: string = '';  // Department Name

    @Property()
    public course: string = '';  // Course Name

    @Property()
    public cgpa: number = 0.0;  // CGPA of Student

    @Property()
    public issueDate: string = '';  // Date of Issue (YYYY-MM-DD)

    @Property()
    public hash: string = '';  // Hash of the original certificate file (for authenticity verification)

    @Property()
    public status: string = 'valid';  // Can be 'valid' or 'revoked'
}
