/*
 * SPDX-License-Identifier: Apache-2.0
 */
import {
    Context,
    Contract,
    Info,
    Returns,
    Transaction,
} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';
import { Asset } from './asset';

@Info({
    title: 'CertificateContract',
    description: 'Smart contract for certificate management',
})
export class CertificateContract extends Contract {
    // CreateCertificate issues a new certificate to the world state.
    @Transaction()
    public async CreateCertificate(
        ctx: Context,
        certificateID: string,
        studentName: string,
        university: string,
        department: string,
        course: string,
        cgpa: number,
        issueDate: string,
        hash: string
    ): Promise<void> {
        const exists = await this.CertificateExists(ctx, certificateID);
        if (exists) {
            throw new Error(`The certificate ${certificateID} already exists`);
        }

        const certificate: Asset = {
            docType: 'certificate',
            certificateID,
            studentName,
            university,
            department,
            course,
            cgpa,
            issueDate,
            hash,
            status: 'valid',
        };

        await ctx.stub.putState(
            certificateID,
            Buffer.from(stringify(sortKeysRecursive(certificate)))
        );
    }

    // ReadCertificate returns the certificate stored in the world state.
    @Transaction(false)
    public async ReadCertificate(
        ctx: Context,
        certificateID: string
    ): Promise<string> {
        const certificateJSON = await ctx.stub.getState(certificateID);
        if (certificateJSON.length === 0) {
            throw new Error(`The certificate ${certificateID} does not exist`);
        }
        return certificateJSON.toString();
    }

    // UpdateCertificate allows updating non-critical fields like course name or department.
    @Transaction()
    public async UpdateCertificate(
        ctx: Context,
        certificateID: string,
        hash: string,
        course?: string,
        department?: string,
        cgpa?: number,
        studentName?: string
    ): Promise<void> {
        const certificateString = await this.ReadCertificate(
            ctx,
            certificateID
        );
        const certificate = JSON.parse(certificateString) as Asset;
        certificate.hash = hash;
        if (course) {
            certificate.course = course;
        }
        if (department) {
            certificate.department = department;
        }
        if (cgpa) {
            certificate.cgpa = cgpa;
        }
        if (studentName) {
            certificate.studentName = studentName;
        }
        await ctx.stub.putState(
            certificateID,
            Buffer.from(stringify(sortKeysRecursive(certificate)))
        );
    }

    // VerifyCertificate checks if the certificate is valid by comparing its hash.
    @Transaction(false)
    public async VerifyCertificate(
        ctx: Context,
        certificateID: string,
        providedHash: string
    ): Promise<boolean> {
        const certificateString = await this.ReadCertificate(
            ctx,
            certificateID
        );
        const certificate = JSON.parse(certificateString) as Asset;

        if (
            certificate.hash === providedHash &&
            certificate.status === 'valid'
        ) {
            return true;
        }
        return false;
    }

    // RevokeCertificate marks the certificate as revoked.
    @Transaction()
    public async RevokeCertificate(
        ctx: Context,
        certificateID: string
    ): Promise<void> {
        const certificateString = await this.ReadCertificate(
            ctx,
            certificateID
        );
        const certificate = JSON.parse(certificateString) as Asset;

        certificate.status = 'revoked';

        await ctx.stub.putState(
            certificateID,
            Buffer.from(stringify(sortKeysRecursive(certificate)))
        );
    }

    // CertificateExists checks if a certificate exists in the world state.
    @Transaction(false)
    @Returns('boolean')
    public async CertificateExists(
        ctx: Context,
        certificateID: string
    ): Promise<boolean> {
        const certificateJSON = await ctx.stub.getState(certificateID);
        return certificateJSON.length > 0;
    }

    // GetAllCertificates retrieves all certificates stored in the blockchain.
    @Transaction(false)
    @Returns('string')
    public async GetAllCertificates(ctx: Context): Promise<string> {
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();

        while (!result.done) {
            const strValue = Buffer.from(
                result.value.value.toString()
            ).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue) as Asset;
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }
}
