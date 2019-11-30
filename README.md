# casd-json-schema

Get a JS friendly schema representation of the CA Service Management objects.

This can be used for faster discovery and opens the door for enhanced tooling/automation around querying the CA system.

## Implementation choices

The only documentation and data that exists is the technical reference PDF, and the online version.

HTML is fairly easy to parse, so this project uses Puppeter to browse through the documentation as needed, building up a standard JSON representation of:

 * all "objects," as defined by CA Web Services, including their appropriate attribute names
 * relationships between objects via foreign keys

## I thought SOAP handles this for me?

Perhaps a well implemented SOAP API can properly describe objects and their relationships. When it comes to the `doSelect` API, the "ease of use" afforded by the SOAP protocol goes into the Web Services black box.

## Installation

TBD

## Running locally

Use the scripts to kick it off:

```
./downloadSchema.js # fetch required seed files
./parseSchema.js    # create clean JSON representation from the Documentation website
```
