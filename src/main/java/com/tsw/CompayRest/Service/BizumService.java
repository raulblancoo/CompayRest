package com.tsw.CompayRest.Service;

import com.tsw.CompayRest.Dto.BizumDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BizumService {
    List<BizumDto> findBizumsByGroupId(Long groupId);

}
