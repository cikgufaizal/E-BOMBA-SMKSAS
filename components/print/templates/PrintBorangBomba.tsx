import React from 'react';
import { SystemData, ReportType } from '../../../types';

interface Props {
  data: SystemData;
  type: ReportType;
  targetId?: string;
}

const PrintBorangBomba: React.FC<Props> = ({ data, type, targetId }) => {
  return (
    <div>
      <h1>Borang Bomba</h1>
      <p>Not implemented yet.</p>
    </div>
  );
};

export default PrintBorangBomba;