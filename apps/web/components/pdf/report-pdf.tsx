/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'Helvetica' },
    { src: 'Helvetica-Bold', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2 solid #2563eb',
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1e3a5f',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    fontSize: 9,
    color: '#6b7280',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1e3a5f',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottom: '1 solid #e5e7eb',
  },
  propertyInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 10,
  },
  infoItem: {
    marginRight: 20,
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 10,
  },
  roomCard: {
    marginBottom: 15,
    border: '1 solid #e5e7eb',
    borderRadius: 4,
    padding: 12,
  },
  roomTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
    color: '#374151',
  },
  roomNotes: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    width: '48%',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: 150,
    objectFit: 'cover',
    borderRadius: 3,
    border: '1 solid #e5e7eb',
  },
  photoCaption: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 3,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '1 solid #e5e7eb',
    paddingTop: 8,
  },
  timestamp: {
    fontSize: 8,
    color: '#9ca3af',
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    fontSize: 8,
    color: '#6b7280',
  },
});

const REPORT_TYPE_LABELS: Record<string, string> = {
  move_in: 'Move-In Inspection',
  move_out: 'Move-Out Inspection',
  maintenance: 'Maintenance Inspection',
};

interface PhotoData {
  id: string;
  caption: string | null;
  imageUrl: string;
}

interface RoomData {
  id: string;
  room_type: string;
  room_label: string | null;
  notes: string | null;
  photos: PhotoData[];
}

interface PropertyData {
  address_line1: string;
  address_line2?: string | null;
  unit_number?: string | null;
  city: string;
  state: string;
  zip: string;
  property_type: string;
  landlord_name?: string | null;
  deposit_amount?: number | null;
}

interface ReportPDFProps {
  reportType: string;
  createdAt: string;
  completedAt: string | null;
  property: PropertyData;
  rooms: RoomData[];
}

export function ReportPDF({ reportType, createdAt, completedAt, property, rooms }: ReportPDFProps) {
  const totalPhotos = rooms.reduce((sum, r) => sum + r.photos.length, 0);
  const address = [
    property.address_line1,
    property.address_line2,
    property.unit_number ? `Unit ${property.unit_number}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Document>
      {/* Cover / Summary Page */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {REPORT_TYPE_LABELS[reportType] ?? 'Condition Report'}
          </Text>
          <Text style={styles.subtitle}>{address}</Text>
          <View style={styles.meta}>
            <Text>
              Created: {new Date(createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
            {completedAt && (
              <Text>
                Completed: {new Date(completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            )}
            <Text>
              {rooms.length} room{rooms.length !== 1 ? 's' : ''} · {totalPhotos} photo{totalPhotos !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Information</Text>
          <View style={styles.propertyInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{address}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>City / State / ZIP</Text>
              <Text style={styles.infoValue}>
                {property.city}, {property.state} {property.zip}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={{ ...styles.infoValue, textTransform: 'capitalize' }}>
                {property.property_type}
              </Text>
            </View>
            {property.landlord_name && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Landlord</Text>
                <Text style={styles.infoValue}>{property.landlord_name}</Text>
              </View>
            )}
            {property.deposit_amount && (
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Security Deposit</Text>
                <Text style={styles.infoValue}>
                  ${Number(property.deposit_amount).toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.disclaimer}>
          <Text>
            This condition report was generated by ConditionLog. All photos are timestamped and
            unaltered. This document serves as a photographic record of the property&apos;s
            condition at the time of inspection.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>ConditionLog — Condition Report</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* One page (or more) per room */}
      {rooms.map((room) => (
        <Page key={room.id} size="LETTER" style={styles.page}>
          <View style={styles.roomCard}>
            <Text style={styles.roomTitle}>
              {room.room_label ?? room.room_type}
            </Text>
            {room.notes && <Text style={styles.roomNotes}>{room.notes}</Text>}

            {room.photos.length > 0 ? (
              <View style={styles.photoGrid}>
                {room.photos.map((photo) => (
                  <View key={photo.id} style={styles.photoContainer}>
                    <Image style={styles.photo} src={photo.imageUrl} />
                    {photo.caption && (
                      <Text style={styles.photoCaption}>{photo.caption}</Text>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.roomNotes}>No photos documented for this room</Text>
            )}
          </View>

          <View style={styles.footer} fixed>
            <Text>ConditionLog — Condition Report</Text>
            <Text
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
}
